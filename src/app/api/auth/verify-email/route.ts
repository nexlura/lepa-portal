import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST() {
  //make login request to API server
  try {
    const data = {
      exists: true,
    };

    await setTimeout(() => {}, 2000);

    return new Response(JSON.stringify(data), {
      status: 200,
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return NextResponse.json(
        { message: `${error.response?.data.message}` },
        { status: error.response?.data.code }
      );
    } else {
      //can't connect to server
      return NextResponse.json(
        { message: 'An unexpected error occurred. Please try again later.' },
        { status: 500 }
      );
    }
  }
}
