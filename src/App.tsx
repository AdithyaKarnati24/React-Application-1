import React, { useState, useEffect } from 'react';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './App.css';

interface Artwork {
  id: string;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string | null;
  date_start: string | null;
  date_end: string | null;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const [rowCount, setRowCount] = useState(10);

  const fetchArtworks = async (pageNumber: number, rows: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rows}`
      );
      const data = response.data.data.map((item: any) => ({
        id: item.id,
        title: item.title,
        place_of_origin: item.place_of_origin,
        artist_display: item.artist_display,
        inscriptions: item.inscriptions,
        date_start: item.date_start,
        date_end: item.date_end,
      }));
      setArtworks(data);
      setTotalRecords(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks(page, rowCount);
  }, [page, rowCount]);

  const onPageChange = (event: DataTablePageEvent) => {
    const newPage = event.page ?? 0; 
    setPage(newPage + 1);
  };
  
  const onSelectionChange = (e: { value: Artwork[] }) => {
    setSelectedRows(e.value);
  };

  const handleTitleChevronClick = () => {
    const input = prompt('Enter the number of rows to display:');
    const rows = parseInt(input || '10', 10);
    if (!isNaN(rows) && rows > 0) {
      setRowCount(rows); 
    } else {
      alert('Invalid number of rows!');
    }
  };

  const titleHeaderTemplate = () => {
    return (
      <div className="title-header">
        <i
          className="pi pi-chevron-down"
          style={{ marginRight: '0.5rem', cursor: 'pointer' }}
          onClick={handleTitleChevronClick}
        ></i>
        Title
      </div>
    );
  };

  return (
    <div className="card">
      <h1>Data Table</h1>
      <DataTable
        value={artworks}
        paginator
        lazy
        rows={rowCount}
        totalRecords={totalRecords}
        first={(page - 1) * rowCount}
        onPage={onPageChange}
        loading={loading}
        responsiveLayout="scroll"
        selectionMode="multiple"
        selection={selectedRows}
        onSelectionChange={onSelectionChange}
        dataKey="id"
      >
        <Column selectionMode="multiple" headerStyle={{ width: '4rem', textAlign: 'center' }}></Column>
        <Column field="title" header={titleHeaderTemplate()} />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
};
export default App;