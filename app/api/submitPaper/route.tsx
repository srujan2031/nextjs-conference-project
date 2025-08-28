import { NextResponse } from 'next/server';
// import mysql from 'mysql2/promise';
import mysql, { ResultSetHeader } from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

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

const uploadPath = path.join(process.cwd(), 'public/papers');

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id'); // Extract the ID from the query params if provided
  
    try {
      const connection = await connectToDatabase();
  
      if (id) {
        // Fetch a single conference by ID
        const [rows] = await connection.execute('SELECT * FROM paper_submissions WHERE id = ?', [id]);
        await connection.end();
  
        return NextResponse.json(rows); // Return the single conference
      } else {
        // Fetch all conferences if no ID is provided
        const [rows] = await connection.execute('SELECT * FROM paper_submissions');
        await connection.end();
        return NextResponse.json(rows); // Return all conferences
      }
    } catch (error) {
      console.error('Database fetch failed:', error);
      return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
  }

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const paperTitle = formData.get('paperTitle')?.toString() || '';
        const researchArea = formData.get('researchArea')?.toString() || '';
        const conferenceId = formData.get('conferenceId')?.toString() || '';
        const author = formData.get('author')?.toString() || '';
        const designation = formData.get('designation')?.toString() || '';
        const institute = formData.get('institute')?.toString() || '';
        const phone = formData.get('phone')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const file = formData.get('file') as File;

        // Validate input
        if (!paperTitle || !researchArea || !conferenceId || !author || !designation || !institute || !phone || !email || !file) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        const connection = await connectToDatabase();

        // First, insert the record to get the auto-incremented ID
        const [result] = await connection.execute<ResultSetHeader>(
            'INSERT INTO paper_submissions (paper_title, research_area, conference_id, author, designation, institute, phone, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [paperTitle, researchArea, conferenceId, author, designation, institute, phone, email]
        );

        const submissionId = result.insertId; // Get the generated ID

        // Define the file path using the generated ID
        const filePath = path.join(uploadPath, `${submissionId}.pdf`);

        // Save the file to the designated folder
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(filePath, buffer);

        // Update the database with the file path
        await connection.execute(
            'UPDATE paper_submissions SET file_path = ? WHERE id = ?',
            [`${submissionId}.pdf`, submissionId]
        );

        await connection.end();

        return NextResponse.json({ message: `Paper submitted successfully! Paper id:${submissionId}` });
    } catch (error) {
        console.error('Database insert failed:', error);
        return NextResponse.json({ error: 'Failed to add data' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  try {

    if(type == 'fee')
    {
      const data = await request.json();
      const {
        fee,
        id
      } = data;

      const connection = await connectToDatabase();
      const [result] = await connection.execute(
          `UPDATE paper_submissions SET 
              feePaid=1,
              fee = ?
          WHERE id = ?`,
          [
            fee,
            id
          ]
      );
      await connection.end();

      return NextResponse.json({ message: 'Review updated successfully' });
    }
    else
    {
      const data = await request.json();
      const {
        reviewed, 
        reviewer_name, 
        reviewer_designation, 
        reviewer_organization, 
        reviewer_phone, 
        reviewer_email, 
        originality, 
        clarity,
        relevance,
        feedback,
        id
      } = data;
      console.log(data)
      const connection = await connectToDatabase();
      const [result] = await connection.execute(
          `UPDATE paper_submissions SET 
              reviewed = ?, 
              reviewer_name = ?, 
              reviewer_designation = ?, 
              reviewer_organization = ?, 
              reviewer_phone = ?, 
              reviewer_email = ?, 
              originality = ?, 
              clarity = ?,
              relevance = ?,
              feedback = ?
          WHERE id = ?`,
          [
            reviewed, 
            reviewer_name, 
            reviewer_designation, 
            reviewer_organization, 
            reviewer_phone, 
            reviewer_email, 
            originality, 
            clarity,
            relevance,
            feedback,
            id
          ]
      );
      await connection.end();

      return NextResponse.json({ message: 'Review updated successfully' });
    }
  } catch (error) {
      console.error('Database update failed:', error);
      return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
  }
}