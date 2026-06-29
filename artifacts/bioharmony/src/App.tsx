import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
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
import AdminSettings from "@/pages/AdminSettings";
import TrackReport from "@/pages/TrackReport";
import PractitionerPortal from "@/pages/PractitionerPortal";
import ReportDelivery from "@/pages/ReportDelivery";
import ClientPortal from "@/pages/ClientPortal";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Disclaimer from "@/pages/Disclaimer";
import WellnessLibrary from "@/pages/WellnessLibrary";
import Feedback from "@/pages/Feedback";
import ArticleAOScan from "@/pages/articles/article-ao-scan";
import ArticlePEMF from "@/pages/articles/article-pemf";
import ArticleFrequencyWellness from "@/pages/articles/article-frequency-wellness";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <ScrollToTop />
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
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/report/:id" component={ReportDelivery} />
          <Route path="/wellness-library" component={WellnessLibrary} />
          <Route path="/wellness-library/ao-scan" component={ArticleAOScan} />
          <Route path="/wellness-library/pemf-therapy" component={ArticlePEMF} />
          <Route path="/wellness-library/frequency-wellness" component={ArticleFrequencyWellness} />
          <Route path="/terms" component={Terms} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/disclaimer" component={Disclaimer} />
          <Route path="/feedback" component={Feedback} />
          <Route path="/about-kathy" component={About} />
          <Route path="/track-my-report" component={TrackReport} />
          <Route path="/terms-of-service" component={Terms} />
          <Route path="/privacy-policy" component={Privacy} />
          <Route path="/wellness-disclaimer" component={Disclaimer} />
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
              <Route path="/admin/settings" component={AdminSettings} />
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
