import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import DreamGlobe from '@/components/dream-globe';
import VoiceForm from '@/components/VoiceForm';

export default function Page() {
  return (
    <div className="h-screen flex overflow-hidden w-screen">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset></SidebarInset>
      </SidebarProvider>
      <DreamGlobe />
      <div className="fixed flex bottom-8 left-1/2 transform -translate-x-1/2  z-50">
        <VoiceForm />
      </div>
    </div>
  );
}
