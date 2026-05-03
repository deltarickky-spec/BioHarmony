import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AOScan from "@/pages/AOScan";
import PEMFTherapy from "@/pages/PEMFTherapy";
import BioHarmonyAnalytics from "@/pages/BioHarmonyAnalytics";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import ForPractitioners from "@/pages/ForPractitioners";
import UploadScan from "@/pages/UploadScan";
import PetScans from "@/pages/PetScans";
import Membership from "@/pages/Membership";
import SampleReport from "@/pages/SampleReport";
import SampleReports from "@/pages/SampleReports";
import AdminLeads from "@/pages/AdminLeads";
import AdminDashboard from "@/pages/AdminDashboard";
import TrackReport from "@/pages/TrackReport";
import PractitionerPortal from "@/pages/PractitionerPortal";

const queryClient = new QueryClient();

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/ao-scan" component={AOScan} />
          <Route path="/pemf-therapy" component={PEMFTherapy} />
          <Route path="/bioharmony-analytics" component={BioHarmonyAnalytics} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/for-practitioners" component={ForPractitioners} />
          <Route path="/upload-scan" component={UploadScan} />
          <Route path="/pet-scans" component={PetScans} />
          <Route path="/membership" component={Membership} />
          <Route path="/sample-report" component={SampleReport} />
          <Route path="/sample-reports" component={SampleReports} />
          <Route path="/track-report" component={TrackReport} />
          <Route path="/practitioner-portal" component={PractitionerPortal} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Switch>
              <Route path="/admin" component={AdminDashboard} />
              <Route path="/admin/leads" component={AdminLeads} />
              <Route component={Router} />
            </Switch>
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
