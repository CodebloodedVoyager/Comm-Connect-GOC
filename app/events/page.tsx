"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Calendar, Users, ExternalLink, Navigation } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

interface TechEvent {
  id: string
  title: string
  date: string
  location: string
  city: string
  organizer: string
  type: string
  description: string
  registrationLink: string
  distance?: number
}

// Function to generate upcoming dates
const getUpcomingDate = (daysFromNow: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split("T")[0]
}

const generateUpcomingEvents = (city = "San Francisco, CA"): TechEvent[] => [
  {
    id: "1",
    title: "Google Developer Group DevFest 2025",
    date: getUpcomingDate(5),
    location: "Tech Hub Convention Center",
    city: city,
    organizer: "Google Developer Group",
    type: "Conference",
    description:
      "Join us for the biggest developer festival of the year with talks on AI, Cloud, and Mobile development.",
    registrationLink: "https://gdg.dev/devfest",
  },
  {
    id: "2",
    title: "AI/ML Workshop Series",
    date: getUpcomingDate(12),
    location: "Innovation Campus",
    city: city,
    organizer: "Microsoft Learn Student Ambassadors",
    type: "Workshop",
    description: "Hands-on workshop covering machine learning fundamentals and practical AI applications.",
    registrationLink: "https://aka.ms/mlsa-workshop",
  },
  {
    id: "3",
    title: "Startup Pitch Competition",
    date: getUpcomingDate(18),
    location: "University Entrepreneurship Center",
    city: city,
    organizer: "Local E-Cell",
    type: "Competition",
    description: "Present your startup ideas to industry experts and compete for funding opportunities.",
    registrationLink: "https://startup-pitch.com/register",
  },
  {
    id: "4",
    title: "React Native Meetup",
    date: getUpcomingDate(8),
    location: "WeWork Downtown",
    city: city,
    organizer: "React Native Community",
    type: "Meetup",
    description: "Monthly meetup for React Native developers to share experiences and learn new techniques.",
    registrationLink: "https://meetup.com/react-native",
  },
  {
    id: "5",
    title: "Blockchain & Web3 Summit",
    date: getUpcomingDate(25),
    location: "Crypto Convention Hall",
    city: city,
    organizer: "Web3 Developers Alliance",
    type: "Summit",
    description: "Explore the future of decentralized applications and blockchain technology.",
    registrationLink: "https://web3summit.dev",
  },
  {
    id: "6",
    title: "Women in Tech Networking",
    date: getUpcomingDate(15),
    location: "Tech Diversity Center",
    city: city,
    organizer: "Women Who Code",
    type: "Networking",
    description: "Connect with fellow women in technology and share career experiences.",
    registrationLink: "https://womenwhocode.com/networking",
  },
  {
    id: "7",
    title: "DevOps & Cloud Infrastructure Meetup",
    date: getUpcomingDate(22),
    location: "Cloud Computing Center",
    city: city,
    organizer: "DevOps Community",
    type: "Meetup",
    description: "Learn about the latest trends in DevOps, containerization, and cloud infrastructure.",
    registrationLink: "https://devops-meetup.com",
  },
  {
    id: "8",
    title: "Cybersecurity Awareness Workshop",
    date: getUpcomingDate(30),
    location: "Security Training Institute",
    city: city,
    organizer: "CyberSec Alliance",
    type: "Workshop",
    description: "Essential cybersecurity practices for developers and IT professionals.",
    registrationLink: "https://cybersec-workshop.com",
  },
  {
    id: "9",
    title: "UI/UX Design Thinking Session",
    date: getUpcomingDate(10),
    location: "Design Studio Hub",
    city: city,
    organizer: "UX Designers Guild",
    type: "Workshop",
    description: "Interactive session on design thinking methodologies and user experience best practices.",
    registrationLink: "https://ux-design-session.com",
  },
  {
    id: "10",
    title: "Open Source Contribution Hackathon",
    date: getUpcomingDate(35),
    location: "Innovation Lab",
    city: city,
    organizer: "Open Source Community",
    type: "Hackathon",
    description: "48-hour hackathon focused on contributing to popular open source projects.",
    registrationLink: "https://opensource-hack.com",
  },
]

export default function EventsPage() {
  const [events, setEvents] = useState<TechEvent[]>([])
  const [userLocation, setUserLocation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [manualCity, setManualCity] = useState("")
  const [searchedCity, setSearchedCity] = useState("")

  const getUserLocation = () => {
    setIsLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulate location detection
          const defaultCity = "San Francisco, CA"
          setUserLocation(defaultCity)
          setEvents(generateUpcomingEvents(defaultCity))
          setIsLoading(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          const defaultCity = "San Francisco, CA"
          setUserLocation(defaultCity)
          setEvents(generateUpcomingEvents(defaultCity))
          setIsLoading(false)
        },
      )
    } else {
      const defaultCity = "San Francisco, CA"
      setUserLocation(defaultCity)
      setEvents(generateUpcomingEvents(defaultCity))
      setIsLoading(false)
    }
  }

  const searchEventsByCity = (city: string) => {
    setIsLoading(true)
    // Simulate API call with city parameter
    setTimeout(() => {
      setUserLocation(city)
      setSearchedCity(city)
      // Generate events for the searched city
      const cityEvents = generateUpcomingEvents(city)
      setEvents(cityEvents)
      setIsLoading(false)
    }, 1000)
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  const getEventTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "conference":
        return "bg-blue-100 text-blue-800"
      case "workshop":
        return "bg-green-100 text-green-800"
      case "meetup":
        return "bg-purple-100 text-purple-800"
      case "competition":
        return "bg-red-100 text-red-800"
      case "summit":
        return "bg-yellow-100 text-yellow-800"
      case "networking":
        return "bg-pink-100 text-pink-800"
      case "hackathon":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if the date is today or tomorrow
    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow"
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    }
  }

  const getDaysUntilEvent = (dateString: string): number => {
    const eventDate = new Date(dateString)
    const today = new Date()
    const timeDifference = eventDate.getTime() - today.getTime()
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
    return daysDifference
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tech Events Finder</h1>
              <p className="text-gray-600">Discover upcoming tech events and meetups near you</p>
            </div>
          </div>
          <MapPin className="h-8 w-8 text-orange-600" />
        </div>

        {/* Location Info */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Navigation className="h-5 w-5 mr-2 text-orange-600" />
              Event Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Current Location Display */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{userLocation || "No location set"}</span>
                </div>
                <Button variant="outline" size="sm" onClick={getUserLocation}>
                  <Navigation className="h-4 w-4 mr-2" />
                  Use My Location
                </Button>
              </div>

              {/* Manual City Search */}
              <div className="border-t pt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Or search events in a specific city:
                </label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter city name (e.g., New York, London, Tokyo)"
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && manualCity.trim()) {
                        searchEventsByCity(manualCity.trim())
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => {
                      if (manualCity.trim()) {
                        searchEventsByCity(manualCity.trim())
                      }
                    }}
                    disabled={!manualCity.trim() || isLoading}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-600 mx-auto"></div>
              <p className="text-xl text-gray-600">Finding tech events near you...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Upcoming Events ({events.length})</h2>
              <span className="text-sm text-gray-500">
                {searchedCity ? `Showing events in ${searchedCity}` : `Showing events in and around ${userLocation}`}
              </span>
            </div>

            <div className="grid gap-6">
              {events.map((event) => {
                const daysUntil = getDaysUntilEvent(event.date)
                return (
                  <Card key={event.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-gray-900">{event.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span className="font-medium">{formatDate(event.date)}</span>
                              {daysUntil <= 7 && daysUntil > 0 && (
                                <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  In {daysUntil} day{daysUntil !== 1 ? "s" : ""}
                                </span>
                              )}
                              {daysUntil === 0 && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                  Today!
                                </span>
                              )}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {event.city}
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {event.organizer}
                            </div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                          {event.type}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">📍 {event.location}</div>
                        <Button
                          asChild
                          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                        >
                          <a href={event.registrationLink} target="_blank" rel="noopener noreferrer">
                            Register Now
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* No Events Message */}
            {events.length === 0 && !isLoading && (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found in your area</h3>
                  <p className="text-gray-600 mb-4">
                    Try expanding your search radius or check back later for new events.
                  </p>
                  <Button variant="outline" onClick={getUserLocation}>
                    Refresh Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
