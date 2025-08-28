import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Helper function to connect to the database
async function connectToDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
	port: '3325'
  });
  return connection;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Extract the ID from the query params if provided

  try {
    const connection = await connectToDatabase();

    if (id) {
      // Fetch a single conference by ID
      const [rows] = await connection.execute('SELECT * FROM mentoring WHERE mentorid = ?', [id]);
      await connection.end();

      return NextResponse.json(rows); // Return the single conference
    } else {
      // Fetch all conferences if no ID is provided
      const [rows] = await connection.execute('SELECT * FROM mentoring');
      await connection.end();
      return NextResponse.json(rows); // Return all conferences
    }
  } catch (error) {
    console.error('Database fetch failed:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
      const data = await request.json();
      const {
        registeredUsers,
        id
      } = data;
      console.log(data)
      const connection = await connectToDatabase();
      const [result] = await connection.execute(
          `UPDATE mentoring SET 
              registeredUsers = ?
          WHERE id = ?`,
          [
            registeredUsers,
            id
          ]
      );
      await connection.end();

      return NextResponse.json({ message: 'Conference updated successfully' });
  } catch (error) {
      console.error('Database update failed:', error);
      return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { mentorid, registeredUsers } = data;

    const connection = await connectToDatabase();

    // Execute the insert query
    // const [result] = await connection.execute(
    //   'INSERT INTO mentoring (name, usertype, designation, institute, phone, email, password) VALUES (?, ?, ?,?,?,?,?)',
    //   [name, type, designation, institute, phone, email, password]
    // );

    await connection.end();

    // Return the result, including the insertId if you need it
    return NextResponse.json({ 
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Database insert failed:', error);
    return NextResponse.json({ error: 'Failed to add data', errorObj:error }, { status: 500 });
  }
}


// DELETE: Remove a conference by ID
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Conference ID is required' }, { status: 400 });
    }

    const connection = await connectToDatabase();
    const [result] = await connection.execute('DELETE FROM mentoring WHERE id = ?', [id]);
    await connection.end();

    return NextResponse.json({ message: 'user deleted successfully' });
  } catch (error) {
    console.error('Database delete failed:', error);
    return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
  }
}
