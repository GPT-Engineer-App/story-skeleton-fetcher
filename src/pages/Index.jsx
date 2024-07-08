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
        className="mb-4"
      />
      {isLoading && (
        <div>
          {[...Array(10)].map((_, index) => (
            <Skeleton key={index} className="w-full h-20 mb-4" />
          ))}
        </div>
      )}
      {error && (
        <Alert>
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to fetch stories. Please try again later.</AlertDescription>
        </Alert>
      )}
      {filteredStories?.map((story) => (
        <Card key={story.id} className="mb-4">
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{story.score} upvotes</p>
            <a href={story.url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              Read more
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Index;
