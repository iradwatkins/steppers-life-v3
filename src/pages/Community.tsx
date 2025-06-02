
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Heart, Share2, Users, TrendingUp, Plus, Search, Filter } from 'lucide-react';

const Community = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [newPost, setNewPost] = useState('');

  const posts = [
    {
      id: 1,
      author: "Marcus Johnson",
      authorImage: "/placeholder.svg",
      badge: "Master Stepper",
      time: "2 hours ago",
      content: "Just finished an amazing workshop in Chicago! The energy was incredible and seeing everyone's progress was so rewarding. Remember, it's not about perfection - it's about the passion and connection to the music. Keep stepping! 💃🕺",
      image: "/placeholder.svg",
      likes: 45,
      comments: 12,
      shares: 8,
      liked: false
    },
    {
      id: 2,
      author: "Lisa Davis",
      authorImage: "/placeholder.svg",
      badge: "Verified Instructor",
      time: "4 hours ago",
      content: "Throwback to last week's competition! So proud of all my students who participated. Win or lose, you all showed incredible spirit and skill. The stepping community is truly special. 🏆",
      likes: 32,
      comments: 18,
      shares: 5,
      liked: true
    },
    {
      id: 3,
      author: "Angela Smith",
      authorImage: "/placeholder.svg",
      badge: "Community Member",
      time: "1 day ago",
      content: "Looking for a stepping partner in Atlanta! I'm intermediate level and love social dancing. Would love to connect with someone who shares the passion. Drop me a message! 💌",
      likes: 28,
      comments: 15,
      shares: 3,
      liked: false
    },
    {
      id: 4,
      author: "DJ Smooth",
      authorImage: "/placeholder.svg",
      badge: "Event Organizer",
      time: "2 days ago",
      content: "Saturday's social was OFF THE HOOK! 🔥 Thank you to everyone who came out and showed love. Next event is already in the works - stay tuned for details!",
      image: "/placeholder.svg",
      likes: 67,
      comments: 24,
      shares: 12,
      liked: true
    }
  ];

  const groups = [
    {
      id: 1,
      name: "Chicago Steppers United",
      members: 1245,
      category: "Local Community",
      image: "/placeholder.svg",
      description: "The largest stepping community in Chicago"
    },
    {
      id: 2,
      name: "Beginner Steppers Support",
      members: 892,
      category: "Learning",
      image: "/placeholder.svg",
      description: "A supportive space for new steppers"
    },
    {
      id: 3,
      name: "Competition Prep Squad",
      members: 456,
      category: "Competition",
      image: "/placeholder.svg",
      description: "Training tips and competition announcements"
    },
    {
      id: 4,
      name: "Step Music Lovers",
      members: 734,
      category: "Music",
      image: "/placeholder.svg",
      description: "Share and discover stepping music"
    }
  ];

  const trending = [
    { tag: "#ChicagoStepping", posts: 234 },
    { tag: "#StepWorkshop", posts: 189 },
    { tag: "#SteppersUnite", posts: 156 },
    { tag: "#CompetitionSeason", posts: 143 },
    { tag: "#StepMusic", posts: 127 }
  ];

  const handleLike = (postId: number) => {
    console.log(`Liked post ${postId}`);
  };

  const handleComment = (postId: number) => {
    console.log(`Comment on post ${postId}`);
  };

  const handleShare = (postId: number) => {
    console.log(`Shared post ${postId}`);
  };

  return (
    <div className="min-h-screen bg-background-main py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-bold text-text-primary mb-4">
            Community
          </h1>
          <p className="text-text-secondary text-lg">
            Connect, share, and grow with the stepping community
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-surface-contrast rounded-lg p-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'feed'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-2" />
            Feed
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'groups'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Groups
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'trending'
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="w-4 h-4 inline mr-2" />
            Trending
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                {/* Create Post */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img
                        src="/placeholder.svg"
                        alt="Your Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your stepping journey..."
                          value={newPost}
                          onChange={(e) => setNewPost(e.target.value)}
                          className="mb-4"
                        />
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              📷 Photo
                            </Button>
                            <Button variant="outline" size="sm">
                              🎵 Music
                            </Button>
                          </div>
                          <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Posts */}
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <img
                          src={post.authorImage}
                          alt={post.author}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-text-primary">{post.author}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {post.badge}
                            </Badge>
                            <span className="text-sm text-text-secondary">{post.time}</span>
                          </div>
                          
                          <p className="text-text-primary mb-4">{post.content}</p>
                          
                          {post.image && (
                            <img
                              src={post.image}
                              alt="Post content"
                              className="w-full h-64 object-cover rounded-lg mb-4"
                            />
                          )}
                          
                          <div className="flex items-center justify-between pt-4 border-t border-border-default">
                            <div className="flex gap-6">
                              <button
                                onClick={() => handleLike(post.id)}
                                className={`flex items-center gap-2 transition-colors ${
                                  post.liked ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'
                                }`}
                              >
                                <Heart className={`w-5 h-5 ${post.liked ? 'fill-current' : ''}`} />
                                <span>{post.likes}</span>
                              </button>
                              <button
                                onClick={() => handleComment(post.id)}
                                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                              >
                                <MessageCircle className="w-5 h-5" />
                                <span>{post.comments}</span>
                              </button>
                              <button
                                onClick={() => handleShare(post.id)}
                                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
                              >
                                <Share2 className="w-5 h-5" />
                                <span>{post.shares}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-text-primary">
                    Community Groups
                  </h2>
                  <Button className="bg-brand-primary hover:bg-brand-primary-hover">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {groups.map((group) => (
                    <Card key={group.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <img
                            src={group.image}
                            alt={group.name}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-text-primary mb-1">
                              {group.name}
                            </h3>
                            <Badge variant="outline" className="mb-2">
                              {group.category}
                            </Badge>
                            <p className="text-text-secondary text-sm mb-3">
                              {group.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-text-secondary">
                                {group.members.toLocaleString()} members
                              </span>
                              <Button variant="outline" size="sm">
                                Join Group
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'trending' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-text-primary">
                  Trending Topics
                </h2>
                
                <div className="space-y-4">
                  {trending.map((trend, index) => (
                    <Card key={trend.tag} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-text-on-primary font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <h3 className="font-semibold text-text-primary text-lg">
                                {trend.tag}
                              </h3>
                              <p className="text-text-secondary">
                                {trend.posts} posts
                              </p>
                            </div>
                          </div>
                          <TrendingUp className="w-6 h-6 text-brand-primary" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total Members</span>
                    <span className="font-semibold text-text-primary">5,847</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Active Groups</span>
                    <span className="font-semibold text-text-primary">23</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Posts Today</span>
                    <span className="font-semibold text-text-primary">142</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Events This Week</span>
                    <span className="font-semibold text-text-primary">8</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="w-4 h-4 mr-2" />
                  Find Stepping Partners
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join a Discussion
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>

            {/* Active Members */}
            <Card>
              <CardHeader>
                <CardTitle>Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Marcus Johnson', 'Lisa Davis', 'Angela Smith', 'DJ Smooth'].map((member, index) => (
                    <div key={member} className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src="/placeholder.svg"
                          alt={member}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <span className="text-sm text-text-primary">{member}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
