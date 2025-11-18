// src/pages/Upload.tsx
// I have corrected this file to be fully functional.

import { useState, useCallback } from "react"; // 1. Import useCallback
import { useDropzone } from "react-dropzone";   // 2. Import useDropzone
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, FileText, Trash2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user's files (This part is correct, no changes needed)
  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Delete file mutation (This part is correct, no changes needed)
  const deleteMutation = useMutation({
    mutationFn: async (fileId: string) => {
      const { error } = await supabase.from('files').delete().eq('id', fileId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast({ title: "File deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting file", description: error.message, variant: "destructive" });
    },
  });

  // 3. MODIFIED this function to accept a File object directly
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('uploaded-files').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('files').insert({
        user_id: user.id,
        filename: file.name,
        file_type: file.type || 'application/octet-stream',
        file_size: file.size,
        storage_path: filePath,
      });
      if (dbError) throw dbError;

      toast({ title: "File uploaded successfully", description: `${file.name} has been uploaded` });
      queryClient.invalidateQueries({ queryKey: ['files'] });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  
  // 4. ADDED onDrop callback for react-dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. ADDED the useDropzone hook
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Upload Your Files
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload CSV, Excel, JSON, or TXT files to analyze with AI
          </p>
        </div>

        {/* 6. REPLACED the Upload Card JSX with the dropzone props */}
        <Card 
            {...getRootProps()} 
            className={`border-2 border-dashed hover:border-primary transition-colors cursor-pointer ${isDragActive ? 'border-primary bg-primary/10' : ''}`}
        >
          <CardContent className="pt-6">
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <UploadIcon className="h-10 w-10 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium">
                  {isDragActive ? "Drop the file here..." : "Drop your file here or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: CSV, Excel, JSON, TXT (Max 10MB)
                </p>
              </div>
              <Button disabled={uploading} type="button">
                {uploading ? "Uploading..." : "Select File"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Files List Card (This part is correct, no changes needed) */}
        <Card>
          <CardHeader>
            <CardTitle>Your Files</CardTitle>
            <CardDescription>{files?.length || 0} file(s) uploaded</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading files...</p>
            ) : files && files.length > 0 ? (
              <div className="space-y-3">
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-8 w-8 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(file.id)} disabled={deleteMutation.isPending}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No files uploaded yet</p>
                <p className="text-sm text-muted-foreground mt-2">Upload your first file to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Upload;




// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Upload as UploadIcon, FileText, Trash2 } from "lucide-react";
// import Layout from "@/components/Layout";
// import { useToast } from "@/hooks/use-toast";
// import { supabase } from "@/integrations/supabase/client";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// const Upload = () => {
//   const [uploading, setUploading] = useState(false);
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   // Fetch user's files
//   const { data: files, isLoading } = useQuery({
//     queryKey: ['files'],
//     queryFn: async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       const { data, error } = await supabase
//         .from('files')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       return data;
//     },
//   });

//   // Delete file mutation
//   const deleteMutation = useMutation({
//     mutationFn: async (fileId: string) => {
//       const { error } = await supabase
//         .from('files')
//         .delete()
//         .eq('id', fileId);
      
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['files'] });
//       toast({ title: "File deleted successfully" });
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Error deleting file",
//         description: error.message,
//         variant: "destructive",
//       });
//     },
//   });

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Validate file type
//     const allowedTypes = ['.csv', '.json', '.txt', '.xlsx', '.xls'];
//     const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
//     if (!allowedTypes.includes(fileExt)) {
//       toast({
//         title: "Invalid file type",
//         description: "Please upload CSV, JSON, TXT, or Excel files only",
//         variant: "destructive",
//       });
//       return;
//     }

//     setUploading(true);

//     try {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('Not authenticated');

//       // Upload to storage
//       const filePath = `${user.id}/${Date.now()}_${file.name}`;
//       const { error: uploadError } = await supabase.storage
//         .from('uploaded-files')
//         .upload(filePath, file);

//       if (uploadError) throw uploadError;

//       // Save metadata to database
//       const { error: dbError } = await supabase
//         .from('files')
//         .insert({
//           user_id: user.id,
//           filename: file.name,
//           file_type: file.type || 'application/octet-stream',
//           file_size: file.size,
//           storage_path: filePath,
//         });

//       if (dbError) throw dbError;

//       toast({
//         title: "File uploaded successfully",
//         description: `${file.name} has been uploaded`,
//       });

//       queryClient.invalidateQueries({ queryKey: ['files'] });
//     } catch (error: any) {
//       toast({
//         title: "Upload failed",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const formatFileSize = (bytes: number) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
//   };

//   return (
//     <Layout>
//       <div className="max-w-4xl mx-auto space-y-8">
//         <div className="text-center space-y-2">
//           <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             Upload Your Files
//           </h1>
//           <p className="text-muted-foreground text-lg">
//             Upload CSV, Excel, JSON, or TXT files to analyze with AI
//           </p>
//         </div>

//         {/* Upload Card */}
//         <Card className="border-2 border-dashed hover:border-primary transition-colors">
//           <CardContent className="pt-6">
//             <div className="flex flex-col items-center justify-center space-y-4 py-8">
//               <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
//                 <UploadIcon className="h-10 w-10 text-primary" />
//               </div>
//               <div className="text-center space-y-2">
//                 <p className="text-lg font-medium">Drop your file here or click to browse</p>
//                 <p className="text-sm text-muted-foreground">
//                   Supports: CSV, Excel, JSON, TXT (Max 10MB)
//                 </p>
//               </div>
//               <label htmlFor="file-upload">
//                 <Button disabled={uploading} className="cursor-pointer">
//                   {uploading ? "Uploading..." : "Select File"}
//                 </Button>
//                 <input
//                   id="file-upload"
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileUpload}
//                   accept=".csv,.json,.txt,.xlsx,.xls"
//                   disabled={uploading}
//                 />
//               </label>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Files List */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Files</CardTitle>
//             <CardDescription>
//               {files?.length || 0} file(s) uploaded
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isLoading ? (
//               <p className="text-center text-muted-foreground py-8">Loading files...</p>
//             ) : files && files.length > 0 ? (
//               <div className="space-y-3">
//                 {files.map((file) => (
//                   <div
//                     key={file.id}
//                     className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
//                   >
//                     <div className="flex items-center gap-3 flex-1">
//                       <FileText className="h-8 w-8 text-primary" />
//                       <div className="flex-1 min-w-0">
//                         <p className="font-medium truncate">{file.filename}</p>
//                         <p className="text-sm text-muted-foreground">
//                           {formatFileSize(file.file_size)} • {new Date(file.created_at).toLocaleDateString()}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => deleteMutation.mutate(file.id)}
//                       disabled={deleteMutation.isPending}
//                     >
//                       <Trash2 className="h-4 w-4 text-destructive" />
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <FileText className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
//                 <p className="text-muted-foreground">No files uploaded yet</p>
//                 <p className="text-sm text-muted-foreground mt-2">
//                   Upload your first file to get started
//                 </p>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// };

// export default Upload;