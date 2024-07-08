import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fetchTopStories = async () => {
  const res = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
  const storyIds = await res.json();
  const top100Ids = storyIds.slice(0, 100);
  const storyPromises = top100Ids.map(id =>
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
  );
  return Promise.all(storyPromises);
};

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });

  const filteredStories = data?.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      <Input
        placeholder="Search stories..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isLoading && (
        <div>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="w-full h-20 mb-4 rounded-md" />
          ))}
        </div>
      )}
      {error && (
        <Alert className="mb-4 border-l-4 border-red-500 bg-red-50 p-4 rounded-md">
          <AlertTitle className="font-bold text-red-700">Error</AlertTitle>
          <AlertDescription className="text-red-700">Failed to fetch stories. Please try again later.</AlertDescription>
        </Alert>
      )}
      {filteredStories?.map((story) => (
        <Card key={story.id} className="mb-4 shadow-md rounded-md">
          <CardHeader className="p-4 border-b">
            <CardTitle className="text-xl font-semibold">{story.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <p className="text-gray-700">{story.score} upvotes</p>
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              Read more
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Index;
