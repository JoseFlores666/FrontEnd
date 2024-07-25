import React from 'react';
import img1 from '../img/imagenPDF.png';

export const Evidencias = () => {
  return (
    <div className="mx-auto max-w-5xl p-4 text-black shadow-md">
      <div className="bg-white p-6 rounded-md shadow-md">
        <div className="">
          <h2 className="text-2xl font-bold text-center text-black mb-6">Evidencias</h2>
        </div>
        <table className="min-w-full divide-y divide-black border border-black">
          <tbody className="bg-white divide-y divide-black">
            <tr className="border border-black">
              <td className="p-4 border border-black">
                <img src={img1} className="w-48 h-48 object-cover mx-auto" />
              </td>
              <td className="p-4 border border-black">
                <img src={img1} className="w-48 h-48 object-cover mx-auto" />
              </td>
            </tr>
           
          </tbody>
        </table>
      </div>
    </div>
  );
};
