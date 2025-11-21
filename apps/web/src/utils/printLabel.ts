// src/utils/printLabel.ts

type OrderItem = {
    name: string;
    qty: number;
  };
  
  type OrderForLabel = {
    user?: { name?: string | null };
    items: OrderItem[];
  };
  
  export function printMiniLabel(order: OrderForLabel) {
    if (!order) return;
  
    const customerName = order.user?.name || "Customer";
  
    // Only first 3 lines for 40x30mm (you can tweak)
    const lines = order.items.slice(0, 3);
  
    const itemsHtml = lines
      .map((item) => {
        // simple bullet style, NO price
        return `<div class="item">• ${sanitize(item.name)} × ${item.qty}</div>`;
      })
      .join("");
  
    const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <title>Label</title>
    <style>
      @page {
        size: 40mm 30mm;
        margin: 1mm;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        padding: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      }
      .label {
        width: 40mm;
        height: 30mm;
        padding: 2mm;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        overflow: hidden;
      }
      .name {
        font-size: 9pt;
        font-weight: 700;
        margin-bottom: 2px;
        text-transform: capitalize;
      }
      .item {
        font-size: 7pt;
        line-height: 1.2;
      }
    </style>
  </head>
  <body>
    <div class="label">
      <div class="name">🧾 ${sanitize(customerName)}</div>
      ${itemsHtml || '<div class="item">No items</div>'}
    </div>
    <script>
      window.onload = function() {
        window.print();
        setTimeout(function(){ window.close(); }, 300);
      };
    </script>
  </body>
  </html>
    `;
  
    const win = window.open("", "_blank", "width=400,height=400");
    if (!win) return;
    win.document.open();
    win.document.write(html);
    win.document.close();
  }
  
  function sanitize(str: any): string {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }
  