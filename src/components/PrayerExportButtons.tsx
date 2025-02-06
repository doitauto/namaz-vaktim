
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ExtendedPrayerTime } from "@/lib/types";

interface PrayerExportButtonsProps {
  prayerTimes: ExtendedPrayerTime[] | undefined;
  lang: 'tr' | 'de';
}

export const PrayerExportButtons = ({ prayerTimes, lang }: PrayerExportButtonsProps) => {
  const { toast } = useToast();

  const exportToExcel = async () => {
    if (!prayerTimes || prayerTimes.length === 0) {
      toast({
        title: lang === 'tr' ? 'Hata' : 'Fehler',
        description: lang === 'tr' ? 'Veri bulunamadı' : 'Keine Daten gefunden',
        variant: "destructive"
      });
      return;
    }

    console.log('Exporting to Excel...', prayerTimes);
  };

  const exportToPDF = async () => {
    if (!prayerTimes || prayerTimes.length === 0) {
      toast({
        title: lang === 'tr' ? 'Hata' : 'Fehler',
        description: lang === 'tr' ? 'Veri bulunamadı' : 'Keine Daten gefunden',
        variant: "destructive"
      });
      return;
    }

    console.log('Exporting to PDF...', prayerTimes);
  };

  return (
    <div className="flex justify-end gap-2 mt-4">
      <Button
        variant="outline"
        className="bg-white/5 text-white/70 hover:text-white border-white/10"
        onClick={exportToExcel}
      >
        <FileSpreadsheet className="mr-2 h-4 w-4" />
        {lang === 'tr' ? 'Excel İndir' : 'Excel herunterladen'}
      </Button>
      <Button
        variant="outline"
        className="bg-white/5 text-white/70 hover:text-white border-white/10"
        onClick={exportToPDF}
      >
        <FileDown className="mr-2 h-4 w-4" />
        {lang === 'tr' ? 'PDF İndir' : 'PDF herunterladen'}
      </Button>
    </div>
  );
};

