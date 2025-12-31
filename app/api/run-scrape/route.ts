import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const csvContent = `handle,title,variant_price,variant_compare_at_price,variant_inventory_qty,body_html
dummy-bag,Red Leather Bag,49.99,59.99,100,"This is a test description for the red bag."
dummy-shoe,Blue Running Shoe,89.00,120.00,50,"This is a test description for the blue shoe."`;

    const encoder = new TextEncoder();
    const csvBuffer = encoder.encode(csvContent);

    return new NextResponse(csvBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="test_products.csv"',
      },
    });

  } catch (error) {
    console.error("Dummy Scrape Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}