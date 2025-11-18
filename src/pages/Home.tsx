import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, MessageSquare, BarChart3, Sparkles, FileText, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import heroBg from "@/assets/hero-bg.jpg";
import OurTeam from "@/components/OurTeam";
import Footer from "@/components/Footer"; 

const Home = () => {
  const features = [
    {
      icon: Upload,
      title: "Multi-Format Upload",
      description: "Support for CSV, Excel, JSON, and TXT files with secure cloud storage",
    },
    {
      icon: MessageSquare,
      title: "AI-Powered Analysis",
      description: "Ask natural language questions and get intelligent insights from your data",
    },
    {
      icon: BarChart3,
      title: "Smart Visualizations",
      description: "Automatically generate interactive charts and graphs from your data",
    },
    {
      icon: Sparkles,
      title: "Intelligent Processing",
      description: "Advanced AI models analyze and understand your file contents",
    },
    {
      icon: FileText,
      title: "File Management ",
      description: "Organize and manage all your uploaded files in one place",
    },
    {
      icon: Zap,
      title: "Real-time Responses ",
      description: "Get instant answers and visualizations as you explore your data",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl mb-16">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80 z-10" />
        <div className="relative z-20 px-8 py-20 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
            AI File Assistant
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto opacity-95">
            Upload your files, ask questions, and get intelligent insights with smart chart visualizations
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" asChild className="shadow-lg">
              <Link to="/upload">
                <Upload className="mr-2 h-5 w-5" />
                Upload Files
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-white/10 border-white/30 text-white hover:bg-white/20">
              <Link to="/query">
                <MessageSquare className="mr-2 h-5 w-5" />
                Start Chatting
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Features for Data Analysis
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-2 hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
            <OurTeam />
            </Card>

      {/* How It Works Section */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 ">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">How It Works</CardTitle>
          <CardDescription className="text-lg">
            Simple workflow to unlock insights from your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="font-semibold text-lg">Upload Files</h3>
              <p className="text-sm text-muted-foreground">
                Upload your data files in multiple formats
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="font-semibold text-lg">Ask Questions</h3>
              <p className="text-sm text-muted-foreground">
                Query your data using natural language
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="font-semibold text-lg">AI Processes</h3>
              <p className="text-sm text-muted-foreground">
                Advanced AI analyzes and extracts insights
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold flex items-center justify-center mx-auto">
                4
              </div>
              <h3 className="font-semibold text-lg ">Visualize</h3>
              <p className="text-sm text-muted-foreground">
                View smart charts and interactive dashboards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className=" bg-gradient-to-br from-primary/5 to-secondary/5 border-2">
       <Footer />
       </Card>
    </Layout>
  );
};

export default Home;