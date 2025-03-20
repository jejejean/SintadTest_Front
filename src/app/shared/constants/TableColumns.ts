export interface Column {
  field: string;
  header: string;
}

export class TableColumns {
  static readonly ColumnsEntity: Column[] = [
    { field: 'numDocument', header: 'Num Documento' },
    { field: 'companyName', header: 'Razón Social' },
    { field: 'tradeName', header: 'Nombre Comercial' },
    { field: 'address', header: 'Ubicación' },
    { field: 'phone', header: 'Telefono' },
    { field: 'documentType', header: 'Documento' },
    { field: 'taxpayerType', header: 'Contribuyente' },
    { field: 'state', header: 'Estado' },
    { field: 'actions', header: 'Acciones' },
  ];

  static readonly ColumnsDocumentType: Column[] = [
    { field: 'code', header: 'Código' },
    { field: 'name', header: 'Nombre' },
    { field: 'description', header: 'Descripción' },
    { field: 'state', header: 'Estado' },
  ];

  static readonly ColumnsTaxpayer: Column[] = [
    { field: 'name', header: 'Nombre' },
    { field: 'state', header: 'Estado' },
  ];
}
