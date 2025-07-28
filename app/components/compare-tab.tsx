"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Target, TrendingUp, Medal, Crown } from "lucide-react"
import type { UserComparison } from "../../types/fitness"

interface CompareTabProps {
  userId: string
}

export function CompareTab({ userId }: CompareTabProps) {
  const [leaderboardData] = useState<UserComparison[]>([
    {
      userId: "user-1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      metrics: {
        totalWorkouts: 28,
        avgWeight: 175.2,
        totalCalories: 45600,
        streak: 12,
      },
    },
    {
      userId: "user-2",
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      metrics: {
        totalWorkouts: 25,
        avgWeight: 132.8,
        totalCalories: 38200,
        streak: 8,
      },
    },
    {
      userId: userId,
      name: "You",
      avatar: "/placeholder.svg?height=40&width=40",
      metrics: {
        totalWorkouts: 22,
        avgWeight: 182.4,
        totalCalories: 42100,
        streak: 6,
      },
    },
    {
      userId: "user-4",
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      metrics: {
        totalWorkouts: 19,
        avgWeight: 168.5,
        totalCalories: 35800,
        streak: 4,
      },
    },
    {
      userId: "user-5",
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      metrics: {
        totalWorkouts: 16,
        avgWeight: 125.3,
        totalCalories: 31200,
        streak: 3,
      },
    },
  ])

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <span className="text-sm font-bold text-gray-500">#{index + 1}</span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
      case 1:
        return "bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200"
      case 2:
        return "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200"
      default:
        return "bg-white border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      {/* Weekly Leaderboard */}
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
                <Badge variant="outline" className="text-xs">
                  Jan 20-26
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboardData.map((user, index) => (
                  <Card
                    key={user.userId}
                    className={`${getRankColor(index)} ${user.userId === userId ? "ring-2 ring-blue-500" : ""}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index)}</div>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {user.name}
                              {user.userId === userId && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  You
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">{user.metrics.totalWorkouts} workouts this week</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {user.metrics.streak} day streak
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {user.metrics.totalCalories.toLocaleString()} cal burned
                          </p>
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

      {/* Friends Activity */}
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
                {leaderboardData.slice(0, 3).map((user, index) => (
                  <div
                    key={user.userId}
                    className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-xs">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-600">
                        Completed a {["Push", "Pull", "Legs"][index]} workout • 2h ago
                      </p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                ))}

                <div className="text-center py-4">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Users className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Challenge Center */}
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
                <Target className="h-5 w-5 text-purple-600" />
                <span>Active Challenges</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-2 border-dashed border-purple-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">30-Day Consistency Challenge</h4>
                      <p className="text-sm text-gray-600">Work out at least 4 times per week</p>
                    </div>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">
                      Active
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>18/30 days</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </div>

                <div className="p-4 border-2 border-dashed border-green-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">Team Calorie Burn</h4>
                      <p className="text-sm text-gray-600">Burn 50,000 calories as a team</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      Team
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Team Progress</span>
                      <span>32,400/50,000 cal</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                </div>

                <div className="text-center">
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Browse Challenges
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
