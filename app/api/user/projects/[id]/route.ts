import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyUser } from '@/lib/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params;

    const auth = await verifyUser();
    if (!auth.success || !auth.user) {
      return NextResponse.json( { success: false, message: auth.message || "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        scrapeJobs: { orderBy: { startedAt: 'desc' } }
      }
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Project not found or access denied" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project }, { status: 200 });

  } catch (error) {
    console.error("Get Project Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id: projectId } = await params;

    const auth = await verifyUser();
    if (!auth.success || !auth.user) {
      return NextResponse.json( { success: false, message: auth.message || "Unauthorized" }, { status: 401 });
    }

    const user = auth.user;

    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { userId: true }});

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ success: false, message: "Project not found or access denied" }, { status: 404 });
    }

    
    await prisma.project.delete({ where: { id: projectId }});

    await prisma.subscriptionUsage.update({
      where: { userId: user.id },
      data: { projectsAdded: { decrement: 1 }}
    });

    return NextResponse.json({ success: true, message: "Project deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete Project Error:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}