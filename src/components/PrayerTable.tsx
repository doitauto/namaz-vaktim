
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TableCaption } from "@radix-ui/react-table";
import { Button } from "@/components/ui/button";
import { ExtendedPrayerTime, TimeRange } from "@/lib/types";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { useState } from "react";

interface PrayerTableProps {
  timeRange: TimeRange;
  lang: 'tr' | 'de';
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

const mockData: ExtendedPrayerTime[] = [
  {
    date: '05.02.2025',
    fajr: '05:57',
    sunrise: '07:37',
    dhuhr: '12:39',
    asr: '15:04',
    maghrib: '17:32',
    isha: '19:00'
  },
  // Add more mock data as needed
];

export const PrayerTable = ({ timeRange, lang }: PrayerTableProps) => {
  const [data] = useState<ExtendedPrayerTime[]>(mockData);

  const exportToExcel = () => {
    // TODO: Implement Excel export
    console.log('Exporting to Excel...');
  };

  const exportToPDF = () => {
    // TODO: Implement PDF export
    console.log('Exporting to PDF...');
  };

  return (
    <div className="w-full space-y-4">
      <h2 className="text-2xl font-semibold text-white/90">{getPrayerTitle(timeRange, lang)}</h2>
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
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
            {data.map((prayer) => (
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
