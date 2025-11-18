import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Home, Upload, MessageSquare, BarChart3, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/auth");
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/upload", label: "Upload", icon: Upload },
    { path: "/query", label: "Query", icon: MessageSquare },
    { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI File Assistant
              </span>
            </Link>
            
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.path}
                    variant={isActive ? "default" : "ghost"}
                    asChild
                    size="sm"
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Link>
                  </Button>
                );
              })}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;