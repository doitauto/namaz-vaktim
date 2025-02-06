
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

interface PrayerTableProps {
  timeRange: TimeRange;
  lang: 'tr' | 'de';
  latitude?: number;
  longitude?: number;
}

const getPrayerTitle = (timeRange: TimeRange, lang: 'tr' | 'de') => {
  if (lang === 'tr') {
    switch (timeRange) {
      case 'weekly':
        return 'Haftalık Namaz Vakitleri';
      case 'monthly':
        return 'Aylık Namaz Vakitleri';
      case 'yearly':
        return 'Yıllık Namaz Vakitleri';
    }
  } else {
    switch (timeRange) {
      case 'weekly':
        return 'Wöchentliche Gebetszeiten';
      case 'monthly':
        return 'Monatliche Gebetszeiten';
      case 'yearly':
        return 'Jährliche Gebetszeiten';
    }
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE');
};

export const PrayerTable = ({ timeRange, lang, latitude, longitude }: PrayerTableProps) => {
  const { toast } = useToast();

  const getDaysToFetch = () => {
    switch (timeRange) {
      case 'weekly':
        return 7;
      case 'monthly':
        return 30;
      case 'yearly':
        return 365;
      default:
        return 7;
    }
  };

  const { data: prayerTimes, isLoading } = useQuery({
    queryKey: ['prayerTimes', timeRange, latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) return [];

      const days = getDaysToFetch();
      const dates = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toISOString().split('T')[0];
      });

      const results = await Promise.all(
        dates.map(async (date) => {
          const params = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            method: '13',
            school: '1',
            adjustment: '1'
          });

          const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date}?${params.toString()}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch prayer times');
          }

          const data = await response.json();
          return {
            date: formatDate(date),
            fajr: data.data.timings.Fajr,
            sunrise: data.data.timings.Sunrise,
            dhuhr: data.data.timings.Dhuhr,
            asr: data.data.timings.Asr,
            maghrib: data.data.timings.Maghrib,
            isha: data.data.timings.Isha
          };
        })
      );

      return results;
    },
    enabled: !!latitude && !!longitude
  });

  const exportToExcel = async () => {
    if (!prayerTimes || prayerTimes.length === 0) {
      toast({
        title: lang === 'tr' ? 'Hata' : 'Fehler',
        description: lang === 'tr' ? 'Veri bulunamadı' : 'Keine Daten gefunden',
        variant: "destructive"
      });
      return;
    }

    // TODO: Implement Excel export
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

    // TODO: Implement PDF export
    console.log('Exporting to PDF...', prayerTimes);
  };

  if (isLoading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white/70"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold text-white/90">{getPrayerTitle(timeRange, lang)}</h2>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-white/5">
                <TableHead className="text-white/70">{lang === 'tr' ? 'Tarih' : 'Datum'}</TableHead>
                <TableHead className="text-white/70">Imsak</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Güneş' : 'Sonne'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Öğle' : 'Mittag'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'İkindi' : 'Nachmittag'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Akşam' : 'Abend'}</TableHead>
                <TableHead className="text-white/70">{lang === 'tr' ? 'Yatsı' : 'Nacht'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prayerTimes && prayerTimes.map((prayer) => (
                <TableRow key={prayer.date} className="hover:bg-white/5">
                  <TableCell className="text-white/90">{prayer.date}</TableCell>
                  <TableCell className="text-white/90">{prayer.fajr}</TableCell>
                  <TableCell className="text-white/90">{prayer.sunrise}</TableCell>
                  <TableCell className="text-white/90">{prayer.dhuhr}</TableCell>
                  <TableCell className="text-white/90">{prayer.asr}</TableCell>
                  <TableCell className="text-white/90">{prayer.maghrib}</TableCell>
                  <TableCell className="text-white/90">{prayer.isha}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
      </div>
    </div>
  );
};
