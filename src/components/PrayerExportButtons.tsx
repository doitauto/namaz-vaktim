
import { Button } from "@/components/ui/button";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ExtendedPrayerTime } from "@/lib/types";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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

    try {
      const headers = [
        lang === 'tr' ? 'Tarih' : 'Datum',
        'Imsak',
        lang === 'tr' ? 'Güneş' : 'Sonne',
        lang === 'tr' ? 'Öğle' : 'Mittag',
        lang === 'tr' ? 'İkindi' : 'Nachmittag',
        lang === 'tr' ? 'Akşam' : 'Abend',
        lang === 'tr' ? 'Yatsı' : 'Nacht'
      ];

      const data = prayerTimes.map(prayer => [
        prayer.date,
        prayer.fajr,
        prayer.sunrise,
        prayer.dhuhr,
        prayer.asr,
        prayer.maghrib,
        prayer.isha
      ]);

      const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Prayer Times");
      XLSX.writeFile(wb, "prayer_times.xlsx");

      toast({
        title: lang === 'tr' ? 'Başarılı' : 'Erfolg',
        description: lang === 'tr' ? 'Excel dosyası indirildi' : 'Excel-Datei wurde heruntergeladen',
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: lang === 'tr' ? 'Hata' : 'Fehler',
        description: lang === 'tr' ? 'Excel dosyası oluşturulamadı' : 'Excel-Datei konnte nicht erstellt werden',
        variant: "destructive"
      });
    }
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

    try {
      const doc = new jsPDF();
      
      const headers = [
        [
          lang === 'tr' ? 'Tarih' : 'Datum',
          'Imsak',
          lang === 'tr' ? 'Güneş' : 'Sonne',
          lang === 'tr' ? 'Öğle' : 'Mittag',
          lang === 'tr' ? 'İkindi' : 'Nachmittag',
          lang === 'tr' ? 'Akşam' : 'Abend',
          lang === 'tr' ? 'Yatsı' : 'Nacht'
        ]
      ];

      const data = prayerTimes.map(prayer => [
        prayer.date,
        prayer.fajr,
        prayer.sunrise,
        prayer.dhuhr,
        prayer.asr,
        prayer.maghrib,
        prayer.isha
      ]);

      autoTable(doc, {
        head: headers,
        body: data,
        theme: 'grid',
        headStyles: { fillColor: [75, 75, 75] },
      });

      doc.save("prayer_times.pdf");

      toast({
        title: lang === 'tr' ? 'Başarılı' : 'Erfolg',
        description: lang === 'tr' ? 'PDF dosyası indirildi' : 'PDF-Datei wurde heruntergeladen',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: lang === 'tr' ? 'Hata' : 'Fehler',
        description: lang === 'tr' ? 'PDF dosyası oluşturulamadı' : 'PDF-Datei konnte nicht erstellt werden',
        variant: "destructive"
      });
    }
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
