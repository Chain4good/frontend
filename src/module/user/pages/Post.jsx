import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getPostBySlug } from "@/services/postService";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  ArrowUp,
  Bookmark,
  MessageCircle,
  User,
  Tag,
  Globe,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Post = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => getPostBySlug(slug),
    enabled: !!slug,
  });

  // Scroll progress tracking
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setReadingProgress(progress);
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.data?.title,
          text: post?.data?.excerpt || post?.data?.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép liên kết!");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatReadTime = (content) => {
    const wordsPerMinute = 200;
    const words = content?.replace(/<[^>]*>/g, "").split(" ").length || 0;
    return Math.ceil(words / wordsPerMinute);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-4"
          >
            <Sparkles className="w-12 h-12 text-primary mx-auto" />
          </motion.div>
          <LoadingSpinner message="Đang tải bài viết..." />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Không thể tải bài viết
          </h3>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <Button onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </Button>
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50"
      id="post"
    >
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-primary to-primary/80 z-50 origin-left"
        style={{ width: `${readingProgress}%` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: readingProgress / 100 }}
        transition={{ duration: 0.1 }}
      />

      {/* Scroll to Top Button */}
      <motion.button
        className={`fixed bottom-8 right-8 w-12 h-12 bg-primary text-white rounded-full shadow-lg z-40 flex items-center justify-center transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <ArrowUp className="w-5 h-5" />
      </motion.button>

      <motion.div
        className="max-w-4xl mx-auto px-4 py-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Navigation Breadcrumb */}
        <motion.div variants={item} className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
            <ChevronRight className="w-4 h-4" />
            <span>Bài viết</span>
            {post?.data?.topic?.name && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{post.data.topic.name}</span>
              </>
            )}
          </div>
        </motion.div>

        {/* Article Header */}
        <motion.header variants={item} className="mb-8">
          {/* Topic Badge */}
          {post?.data?.topic?.name && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
              >
                <Tag className="w-3 h-3 mr-2" />
                {post.data.topic.name}
              </Badge>
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {post?.data?.title}
          </motion.h1>

          {/* Meta Information */}
          <motion.div
            className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post?.data?.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{formatReadTime(post?.data?.content)} phút đọc</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>{post?.data?.views || 0} lượt xem</span>
            </div>
          </motion.div>

          {/* Author */}
          {post?.data?.author && (
            <motion.div
              className="flex items-center gap-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={post.data.author.avatar} />
                <AvatarFallback>
                  <User className="w-6 h-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-gray-900">
                  {post.data.author.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {post.data.author.bio || "Tác giả"}
                </p>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* Featured Image */}
        {post?.data?.thumbnail && (
          <motion.div variants={item} className="relative mb-12 group">
            <div className="relative aspect-video overflow-hidden rounded-3xl shadow-2xl">
              <motion.img
                src={post.data.thumbnail}
                alt={post.data.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          variants={item}
          className="flex items-center justify-between mb-12 p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg"
        >
          <div className="flex items-center gap-4">
            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isLiked
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => setIsLiked(!isLiked)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">
                {isLiked ? "Đã thích" : "Thích"}
              </span>
            </motion.button>

            <motion.button
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                isBookmarked
                  ? "bg-blue-100 text-blue-600 border border-blue-200"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-600"
              }`}
              onClick={() => setIsBookmarked(!isBookmarked)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              <span className="text-sm font-medium">
                {isBookmarked ? "Đã lưu" : "Lưu"}
              </span>
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
              onClick={handleShare}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Share2 className="w-4 h-4" />
              <span className="text-sm font-medium">Chia sẻ</span>
            </motion.button>
          </div>
        </motion.div>

        <Separator className="mb-12" />

        {/* Article Content */}
        <motion.article
          variants={item}
          className="prose prose-lg max-w-none prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded-md prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-img:rounded-xl prose-img:shadow-lg"
        >
          <div dangerouslySetInnerHTML={{ __html: post?.data?.content }} />
        </motion.article>

        {/* Article Footer */}
        <motion.footer
          variants={item}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Bài viết hữu ích?
              </span>
              <Button variant="outline" size="sm" className="gap-2">
                <Heart className="w-4 h-4" />
                Cảm ơn tác giả
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="w-4 h-4" />
                Bình luận
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                Chia sẻ
              </Button>
            </div>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Post;
