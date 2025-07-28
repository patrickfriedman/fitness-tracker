"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Trophy, Target, Plus } from "lucide-react"

interface CompareTabProps {
  userId: string
}

const mockFriends = [
  {
    id: "friend1",
    name: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      workoutsThisWeek: 5,
      caloriesBurned: 2400,
      avgWorkoutDuration: 45,
      consistency: 85,
    },
    achievements: ["7-day streak", "PR Bench Press"],
  },
  {
    id: "friend2",
    name: "Sarah Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      workoutsThisWeek: 4,
      caloriesBurned: 1800,
      avgWorkoutDuration: 38,
      consistency: 78,
    },
    achievements: ["Cardio King", "Early Bird"],
  },
  {
    id: "friend3",
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      workoutsThisWeek: 6,
      caloriesBurned: 3200,
      avgWorkoutDuration: 52,
      consistency: 92,
    },
    achievements: ["Beast Mode", "Consistency Champion"],
  },
]

const leaderboardData = [
  { name: "Mike Rodriguez", score: 3200, metric: "calories burned" },
  { name: "You", score: 2800, metric: "calories burned" },
  { name: "Alex Johnson", score: 2400, metric: "calories burned" },
  { name: "Sarah Chen", score: 1800, metric: "calories burned" },
]

export function CompareTab({ userId }: CompareTabProps) {
  const [selectedMetric, setSelectedMetric] = useState("calories")

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Weekly Leaderboard</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("leaderboard-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="leaderboard-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span>Weekly Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === "You"
                        ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                        : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          index === 0
                            ? "bg-yellow-500 text-white"
                            : index === 1
                              ? "bg-gray-400 text-white"
                              : index === 2
                                ? "bg-orange-500 text-white"
                                : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{entry.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {entry.score} {entry.metric}
                        </p>
                      </div>
                    </div>
                    {index === 0 && <Trophy className="h-5 w-5 text-yellow-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Friends Activity</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("friends-activity-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="friends-activity-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Friends Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockFriends.map((friend) => (
                  <Card key={friend.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={friend.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{friend.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {friend.stats.workoutsThisWeek} workouts this week
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {friend.stats.consistency}% consistent
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-3">
                        <div className="text-center">
                          <p className="text-lg font-bold text-blue-600">{friend.stats.caloriesBurned}</p>
                          <p className="text-xs text-gray-600">Calories</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600">{friend.stats.avgWorkoutDuration}m</p>
                          <p className="text-xs text-gray-600">Avg Duration</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-purple-600">{friend.stats.workoutsThisWeek}</p>
                          <p className="text-xs text-gray-600">Workouts</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-medium text-gray-700 dark:text-gray-300">Achievements:</p>
                        <div className="flex flex-wrap gap-1">
                          {friend.achievements.map((achievement, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Challenge Center</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const widget = document.getElementById("challenge-center-widget")
              if (widget) {
                widget.style.display = widget.style.display === "none" ? "block" : "none"
              }
            }}
            className="h-6 w-6 p-0 text-gray-500"
          >
            <span className="text-xs">−</span>
          </Button>
        </div>
        <div id="challenge-center-widget">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-600" />
                <span>Active Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">30-Day Consistency Challenge</h4>
                      <Badge variant="outline">12/30 days</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Work out at least 4 times per week for 30 days
                    </p>
                    <Progress value={40} className="h-2 mb-2" />
                    <p className="text-xs text-center text-gray-600">18 days remaining</p>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Team Calorie Burn</h4>
                      <Badge variant="outline">2,400/5,000 cal</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Burn 5,000 calories as a team this week
                    </p>
                    <Progress value={48} className="h-2 mb-2" />
                    <p className="text-xs text-center text-gray-600">3 days remaining</p>
                  </CardContent>
                </Card>

                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Join New Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
