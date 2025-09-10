import * as React from "react";
import { Crud } from "@toolpad/core/Crud";
import { useParams } from "react-router";
// import { dataTableSource, TableData, dataTableCache } from '../data/table';

export default function DataTablePage() {
  const { id } = useParams();
  return <div>Data Table Page - Under Construction</div>;
  // return (
  //   <Crud<TableData>
  //     dataSource={dataTableSource}
  //     dataSourceCache={dataTableCache}
  //     rootPath="/datatable"
  //     initialPageSize={25}
  //     defaultValues={{ itemCount: 1 }}
  //     pageTitles={{
  //       show: `Entry ${id}`,
  //       create: 'New Entry',
  //       edit: `Entry ${id} - Edit`,
  //     }}
  //   />
  // );
}
