import  { useState } from 'react';


const evm = [
  'ภาคเหนือและภาคตะวันออกเฉียงเหนือ',
  'ภาคกลางและภาคใต้',
  'สำนักงานใหญ่',
];

const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];

const Form010_3 = () => {
  const [data, setData] = useState<number[][]>(
    evm.map(() => Array(months.length).fill(0))
  );

  const handleChange = (centerIndex: number, monthIndex: number, value: string) => {
    const newData = [...data];
    newData[centerIndex][monthIndex] = parseFloat(value) || 0;
    setData(newData);
  };

  const getRowTotal = (row: number[]) => row.reduce((sum, val) => sum + val, 0);
  const getColumnTotal = (index: number) =>
    data.reduce((sum, row) => sum + row[index], 0);
  const getGrandTotal = () =>
    data.reduce((sum, row) => sum + getRowTotal(row), 0);

  return (
    <div className="overflow-auto p-4">
      <table className="table-auto border-collapse w-full text-center">
      <thead>
  <tr className="bg-gray-200">
    <th className="border px-2 py-1 whitespace-nowrap " rowSpan={2}>ศูนย์การไฟฟ้า</th>
    <th colSpan={months.length + 1} className="border px-2 py-1">ประมาณค่าใช้จ่ายปี 2569</th>
  </tr>
  <tr className="bg-gray-100">
    {months.map((month) => (
      <th key={month} className="border px-2 py-1">{month}</th>
    ))}
    <th className="border px-2 py-1">รวม</th>
  </tr>
        </thead>
        <tbody>
        {evm.map((evm, i) => (
            <tr key={i}>
            <td className="border px-2 py-1 text-left whitespace-nowrap">{evm}</td>
            {months.map((_, j) => (
                <td key={j} className="border px-2 py-1">
                <input
                    type="number"
                    className="w-20 text-right border px-1"
                    value={data[i][j]}
                    onChange={(e) => handleChange(i, j, e.target.value)}
                />
                </td>
            ))}
            <td className="border px-2 py-1 bg-blue-100 text-right">{getRowTotal(data[i]).toLocaleString()}</td>
            </tr>
        ))}
        <tr className="bg-blue-100 font-semibold">
            <td className="border px-2 py-1 text-center">รวมทั้งสิ้น</td>
            {months.map((_, j) => (
            <td key={j} className="border px-2 py-1 text-right">
                {getColumnTotal(j).toLocaleString()}
            </td>
            ))}
            <td className="border px-2 py-1 text-right">{getGrandTotal().toLocaleString()}</td>
        </tr>
        </tbody>

      </table>
    </div>
  );
};

export default Form010_3;
