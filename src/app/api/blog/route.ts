import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { blogService } from "@/lib/firestore";
import { PUBLIC_API_CACHE_HEADERS } from "@/lib/api-cache";

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const publishedParam = request.nextUrl.searchParams.get("published");
    const onlyPublished = publishedParam === "true" || publishedParam === null;
    const posts = await blogService.getAll(onlyPublished);
    const summaryOnly = request.nextUrl.searchParams.get("summary") === "true";
    const responsePosts = summaryOnly && onlyPublished
      ? posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          summary: post.summary,
          imageUrl: post.imageUrl,
          imageAlt: post.imageAlt,
          published: post.published,
          createdAt: post.createdAt,
          readingMinutes: post.content
            ? Math.ceil(post.content.trim().split(/\s+/).length / 200)
            : 0,
        }))
      : posts;
    return NextResponse.json(
      responsePosts,
      onlyPublished ? { headers: PUBLIC_API_CACHE_HEADERS } : undefined
    );
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST /api/blog - Create blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !body.title ||
      !body.slug ||
      !body.summary ||
      !body.content ||
      !body.imageUrl
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const id = await blogService.create(body);
    revalidatePath("/api/blog");
    revalidatePath("/", "page");
    revalidatePath("/blog", "page");
    revalidatePath("/blog/[slug]", "page");
    return NextResponse.json(
      { id, message: "Blog post created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
