import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3 } from "lucide-react";

const Dashboard = () => {
  // Fetch user's queries with chart data
  const { data: queries, isLoading } = useQuery({
    queryKey: ['queries'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .not('chart_data', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', '#8884d8', '#82ca9d', '#ffc658'];

  const renderChart = (chartData: any, index: number) => {
    if (!chartData) return null;

    // Transform data for recharts
    const data = chartData.labels?.map((label: string, i: number) => ({
      name: label,
      value: chartData.datasets?.[0]?.data?.[i] || 0,
    })) || [];

    switch (chartData.type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={COLORS[index % COLORS.length]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[index % COLORS.length]} />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return <p className="text-muted-foreground">Unsupported chart type</p>;
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            View your AI-generated charts and visualizations
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-16">
              <p className="text-muted-foreground">Loading charts...</p>
            </CardContent>
          </Card>
        ) : queries && queries.length > 0 ? (
          <div className="grid gap-6">
            {queries.map((query, index) => (
              <Card key={query.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-xl">{query.query_text}</CardTitle>
                  <CardDescription>
                    {new Date(query.created_at).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-4">{query.response}</p>
                  </div>
                  {query.chart_data && (
                    <div className="border rounded-lg p-4 bg-muted/30">
                      {renderChart(query.chart_data, index)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <BarChart3 className="h-20 w-20 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No charts yet
              </p>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Upload files and ask questions to generate smart visualizations
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;