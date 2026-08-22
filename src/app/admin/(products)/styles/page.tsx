import SeasonsTable from "@/src/components/admin/Styles/components/SeasonsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardContent } from "@/src/components/ui/card";

export default function StylesSeasonsPage() {
  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="style" className="w-full">
        <TabsList className="flex flex-wrap gap-2 w-full justify-start h-auto bg-transparent p-0 mb-6 border-b border-border rounded-none">
          <TabsTrigger 
            value="style" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Style
          </TabsTrigger>
          <TabsTrigger 
            value="material"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Material
          </TabsTrigger>
          <TabsTrigger 
            value="size-chart"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Size Chart Template
          </TabsTrigger>
          <TabsTrigger 
            value="care-label"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Care Label Info
          </TabsTrigger>
          <TabsTrigger 
            value="supplier"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Supplier
          </TabsTrigger>
          <TabsTrigger 
            value="documents"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Documents
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="style" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <SeasonsTable />
        </TabsContent>
        
        <TabsContent value="material" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Material content coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="size-chart" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Size Chart Template content coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="care-label" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Care Label Info content coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="supplier" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Supplier content coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">Documents content coming soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
