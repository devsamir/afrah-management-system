import React from "react";
import ReactFC from "react-fusioncharts";
import FusionCharts from "fusioncharts";
import Chart from "fusioncharts/fusioncharts.charts";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";

ReactFC.fcRoot(FusionCharts, Chart, CandyTheme);

const PembayaranSarungLine = ({ data }) => {
  const config = {
    type: "msline",
    width: "100%",
    height: "500",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Jumlah Nominal Pembayaran",
        subCaption: "Berdasarkan Pembayaran Pembelian Dan Penjualan",
        xAxisName: "Tanggal",
        yAxisName: "Nominal",
        numberPrefix: "",
        theme: "candy",
      },
      categories: [{ category: data?.category || [] }],
      dataSet: [
        { seriesname: "Pemasukan", data: data?.pemasukan || [] },
        { seriesname: "Pengeluaran", data: data?.pengeluaran || [] },
      ],
    },
  };
  return <ReactFC {...config} />;
};

export default PembayaranSarungLine;
