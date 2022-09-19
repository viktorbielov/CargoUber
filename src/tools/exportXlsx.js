const xlsx = require('xlsx');
const path = require('path');

const exportExcel = (data, columnNames, sheetName, filePath) => {
    const workbook = xlsx.utils.book_new();
    const sheetData = [
        columnNames,
        ...data
    ];
    const sheet = xlsx.utils.aoa_to_sheet(sheetData);
    xlsx.utils.book_append_sheet(workbook, sheet, sheetName);
    xlsx.writeFile(workbook, path.resolve(filePath));
}

const exportLoadsToExcel = (loads) => {
    const data = loads.map(load => {
        return [
            load.name, load.status, load.state, load.pickup_address,
            load.delivery_address, load.payload, load.dimensions.width, load.dimensions.length,
            load.dimensions.height, load.created_date, load.uploaded_date
        ];
    })
    exportExcel(data,
        ['Name', 'Status', 'State', 'Pickup Address', 'Delivery Address', 'Payload',
        'Width', 'Length', 'Height', 'Created', 'Uploaded'], 'Loads', './files/loads.xlsx');
}

module.exports = {exportLoadsToExcel};