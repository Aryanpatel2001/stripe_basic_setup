import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, password } = await req.json();
    await dbConnect();

    // 1. Check if user exists
    if (await User.findOne({ email })) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // 2. Create Stripe Customer
    const customer = await stripe.customers.create({
      email,
      name: `${firstName} ${lastName}`,
    });

    // 3. Create User in DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
      stripeCustomerId: customer.id,
    });

    return NextResponse.json({ message: 'User created', userId: user._id });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}

