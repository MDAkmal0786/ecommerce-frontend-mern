import {
  AiOutlineSortAscending,
  AiOutlineSortDescending,
} from "react-icons/ai";
import {
  Column,
  usePagination,
  useSortBy,
  useTable,
  TableOptions,
} from "react-table";    //   TableHOC < PASS object>

function TableHOC<T extends Object> (
  columns : Column<T>[] ,
  data : T[] ,
  containerClassname : string , // for some specific css
  heading : string ,
  showPagination : boolean = false
) { 
  return function HOC() {
    const options: TableOptions<T> = {
      columns,
      data,
      initialState : {
         //@ts-ignore
        pageSize : 6 ,
      } ,
    } ;
    
    const {
       
      getTableProps ,
      getTableBodyProps ,
      headerGroups,  //@ts-ignore
      page,    //@ts-ignore
      prepareRow,  //@ts-ignore

      nextPage,  //@ts-ignore
      pageCount,  //@ts-ignore
      state: { pageIndex },  //@ts-ignore
      previousPage,  //@ts-ignore
      canNextPage,  //@ts-ignore
      canPreviousPage ,

    } = useTable(options, useSortBy, usePagination);

    return (
      <div className={containerClassname}>
        <h2 className="heading">{heading}</h2>

        <table { ...getTableProps() } className="table">
          <thead>
            {headerGroups.map((headerGroup) => {
                const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
             return <tr  key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {  //@ts-ignore

                    const { key, ...restColumn } = column.getHeaderProps(column.getSortByToggleProps());
               return   <th key={key} {...restColumn}>
                    {column.render("Header")}    {/*  @ts-ignore */}

                    

                    {column.isSorted && (  // If sortedi is allowed by getSortToggleProps
                      <span> 
                        {" "} {/*  @ts-ignore */} 
                        { column.isSortedDesc ? (    // add icon for pagination sorting
                          <AiOutlineSortDescending />
                        ) : (
                          <AiOutlineSortAscending />
                        )}
                      </span>
                    )}


                  </th>
            })}
              </tr>
            })}
          </thead>
          <tbody {...getTableBodyProps()}>
            {/*  @ts-ignore */}
            {page.map((row) => {
              {/*  @ts-ignore */}
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();

              return (
                <tr key={key} {...restRowProps}>
                  {/*  @ts-ignore */}
                  {row.cells.map((cell) => {
                     const { key, ...restCellProps } = cell.getCellProps();
                  return  <td key={key} {...restCellProps}>{cell.render("Cell")}</td>
            })}
                </tr>
              );
            })}
          </tbody>
        </table>

        { showPagination && (  
         
         //  if showpagination is   A L L O W E D

          <div className="table-pagination">
            <button disabled={!canPreviousPage} onClick={previousPage}>
              Prev
            </button>
            <span>{`${pageIndex + 1} of ${pageCount}`}</span>
            <button disabled={!canNextPage} onClick={nextPage}>
              Next
            </button>
          </div>
        )}
      </div>
    );
  };
}

export default TableHOC;
