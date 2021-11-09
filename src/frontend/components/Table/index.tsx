import React, { Dispatch, SetStateAction, useState } from "react";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdRemoveRedEye,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import classes from "./table.module.scss";

export interface Columns {
  field: string;
  headerName?: string;
  hide?: boolean;
  width?: number;
  type?: "string" | "number" | "date";
  formatter?: any;
}
interface Props {
  data: any;
  columns: Columns[];
  sort: {
    field: string;
    direction: string;
  };
  setSort: Dispatch<SetStateAction<{}>>;
  result: number;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  limit: number;
  setLimit: Dispatch<SetStateAction<number>>;
  loading: boolean;
  setSearch: Dispatch<SetStateAction<string>>;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  label?: string;
}
const Table: React.FC<Props> = ({
  data,
  columns,
  sort,
  setSort,
  page,
  setPage,
  limit,
  setLimit,
  result,
  loading,
  selected,
  setSelected,
  setSearch,
  label,
}) => {
  const [inputSearch, setInputSearch] = useState("");
  const handleSort = (field: string) => {
    if (sort.field !== field) {
      setSort({ field, direction: "desc" });
    } else if (sort.field === field) {
      if (sort.direction === "desc") {
        setSort({ field, direction: "asc" });
      } else if (sort.direction === "asc") {
        setSort({ field: "", direction: "" });
      }
    }
  };
  const handleLimit = (e: any) => {
    setLimit(Number(e.target.value));
    const dataPointer = (page - 1) * e.target.value + 1;
    if (dataPointer > result) {
      const pagePointer = Math.ceil(result / e.target.value);
      setPage(pagePointer);
    }
  };
  const handlePage = (e: "next" | "before") => {
    if (e === "next") {
      const maxPage = Math.ceil(result / limit);
      if (page < maxPage) {
        setPage(page + 1);
      }
    } else if (e === "before") {
      if (page > 1) {
        setPage(page - 1);
      }
    }
  };
  const handleSelection = (e, id) => {
    if (e.target.id === "span") return;

    if (selected == id) {
      setSelected(``);
    } else {
      setSelected(`${id}`);
    }
  };
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setSearch(inputSearch);
    }
  };
  return (
    <div>
      <div className={classes.formSearch}>
        <label>Search</label>
        <input
          type="text"
          className="form-control"
          onChange={(e) => setInputSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter Search Key"
        />
        <small>{label}</small>
      </div>

      <div className={classes.tableContainer}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th></th>
              {columns.map((col) => {
                if (!col.hide)
                  return (
                    <th key={col.field} onClick={() => handleSort(col.field)}>
                      {col.headerName}
                      <span className={classes.arrowIcon}>
                        {sort.field === col.field &&
                          (sort.direction === "desc" ? (
                            <MdArrowDownward />
                          ) : (
                            <MdArrowUpward />
                          ))}
                      </span>
                    </th>
                  );
              })}
            </tr>
          </thead>
          <tbody>
            {loading &&
              [...Array(limit)].map((item, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr className={classes.row}>
                      <td style={{ maxHeight: "50px" }}>
                        <label className={classes.container}>
                          <input type="checkbox" />
                          <span className={classes.checkmark}></span>
                        </label>
                      </td>
                      {columns.map((col) => {
                        if (!col.hide)
                          return (
                            <td
                              key={col.field}
                              style={{ minWidth: col.width || 150 }}
                            >
                              <div className={classes.skleton}></div>
                            </td>
                          );
                      })}
                    </tr>
                  </React.Fragment>
                );
              })}
            {!loading &&
              data.map((row: any) => {
                return (
                  <tr
                    className={`${classes.row} ${
                      selected == row.id && classes.rowActive
                    }`}
                    onClick={(e) => handleSelection(e, row.id)}
                    key={row.id}
                  >
                    <td style={{ maxHeight: "25px" }}>
                      <label className={classes.container}>
                        <input
                          type="checkbox"
                          checked={selected == row.id ? true : false}
                          onChange={() => {}}
                        />
                        <span
                          className={classes.checkmark}
                          id="span"
                          onClick={() => {}}
                        ></span>
                      </label>
                    </td>
                    {columns.map((col) => {
                      if (!col.hide)
                        return (
                          <td
                            key={col.field}
                            style={{ minWidth: col.width || 150 }}
                          >
                            <div className="d-flex">
                              {col.formatter
                                ? col.formatter(row[col.field])
                                : row[col.field]}
                            </div>
                          </td>
                        );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <div className={classes.tableFooter}>
        <div className={classes.tablePagination}>
          <div className={classes.paginationLimit}>
            <select value={limit} onChange={handleLimit}>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div className={classes.paginationInfo}>
            {loading ? (
              <div className={classes.skleton}></div>
            ) : (
              <>
                {(page - 1) * limit + 1} -
                {page * limit < result ? page * limit : result} / {result} Data
              </>
            )}
          </div>
          <div className={classes.pagination}>
            <button onClick={() => handlePage("before")}>
              <MdKeyboardArrowLeft />
            </button>
            <span>{page}</span>
            <button onClick={() => handlePage("next")}>
              <MdKeyboardArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
