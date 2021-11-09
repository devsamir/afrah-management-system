const duplicateInput = (err: any) => {
  const key = err.message.split(" key ")[1].replace(/['"]+/g, "");
  let message = `duplikasi data, sudah ada data ${key} yang sama didatabase`;

  return `400 : ${message}`;
};

export default function errorHandler(err: any): any {
  let message = err.message || "internal server error";
  const statusCode = err.statusCode || "500";
  const status = "fail";

  if (err.errno === 1062 || err.code === "ER_DUP_ENTRY")
    return duplicateInput(err);

  return `${statusCode} : ${message}`;
}
