import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { InventoryItem, ShoppingItem } from '../types';

export function exportPantryPDF(items: InventoryItem[], householdName: string = 'My Household') {
  const doc = new jsPDF();

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(46, 91, 56); // Sage Green
  doc.text('HAVEN — Household Inventory Report', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Household: ${householdName}  |  Generated on: ${new Date().toLocaleDateString()}`, 14, 27);

  // Table Data
  const tableRows = items.map(item => [
    item.name,
    item.category,
    `${item.quantity} ${item.unit}`,
    item.storageLocation,
    item.expiryDate,
    item.status.replace('_', ' ').toUpperCase()
  ]);

  autoTable(doc, {
    startY: 34,
    head: [['Item Name', 'Category', 'Quantity', 'Location', 'Expiry Date', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [46, 91, 56], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 250, 248] },
    margin: { top: 34 }
  });

  doc.save(`Haven_Pantry_Inventory_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportShoppingPDF(items: ShoppingItem[], householdName: string = 'My Household') {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(46, 91, 56);
  doc.text('HAVEN — Household Shopping List', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Household: ${householdName}  |  Generated on: ${new Date().toLocaleDateString()}`, 14, 27);

  const tableRows = items.map(item => [
    item.name,
    item.category,
    `${item.quantity} ${item.unit}`,
    item.isAiSuggested ? 'Haven AI Suggestion' : 'Manual Entry',
    item.isCompleted ? 'Bought' : 'Pending'
  ]);

  autoTable(doc, {
    startY: 34,
    head: [['Item Name', 'Category', 'Quantity', 'Source', 'Status']],
    body: tableRows,
    headStyles: { fillColor: [217, 155, 38], textColor: 255 }, // Warm Amber
    margin: { top: 34 }
  });

  doc.save(`Haven_Shopping_List_${new Date().toISOString().split('T')[0]}.pdf`);
}
