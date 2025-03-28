"use client";
import { useEffect, useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement
);

interface GitHubRepo {
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  name: string;
  created_at: string;
  languages_url: string;
  languages?: Record<string, number>;
}

interface GitHubUser {
  public_repos: number;
  followers: number;
}

interface GitHubEvent {
  type: string;
  created_at: string;
}

const GitHubStats = () => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const headers = {
          Authorization: `token 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`,
          Accept: "application/vnd.github.v3+json",
        };

        // Fetch user data
        const [userResponse, reposResponse] = await Promise.all([
          fetch("https://api.github.com/users/nk2552003", { headers }),
          fetch("https://api.github.com/users/nk2552003/repos?per_page=100", { headers }),
        ]);

        // Fetch events with pagination
        let eventsData: GitHubEvent[] = [];
        let page = 1;
        let hasMore = true;
        while (hasMore) {
          const eventsResponse = await fetch(
            `https://api.github.com/users/nk2552003/events?per_page=100&page=${page}`,
            { headers }
          );
          const newEvents: GitHubEvent[] = await eventsResponse.json();
          eventsData = [...eventsData, ...newEvents];
          
          const linkHeader = eventsResponse.headers.get('Link');
          hasMore = linkHeader?.includes('rel="next"') ?? false;
          page++;
        }

        const userData: GitHubUser = await userResponse.json();
        const reposData: GitHubRepo[] = await reposResponse.json();

        // Fetch languages for each repository
        const reposWithLanguages = await Promise.all(
          reposData.map(async (repo) => {
            const langResponse = await fetch(repo.languages_url, { headers });
            const languages = await langResponse.json();
            return { ...repo, languages };
          })
        );

        setUserData(userData);
        setRepos(reposWithLanguages);
        setEvents(eventsData);
      } catch (err) {
        setError("Failed to fetch GitHub data");
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, []);

  // Process data for charts
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Stars, Forks, Issues Chart
  const processMainChartData = () => {
    const monthlyData = Array(12).fill(0).map(() => ({
      stars: 0,
      forks: 0,
      issues: 0,
    }));

    repos.forEach((repo) => {
      const month = new Date(repo.created_at).getMonth();
      monthlyData[month].stars += repo.stargazers_count;
      monthlyData[month].forks += repo.forks_count;
      monthlyData[month].issues += repo.open_issues_count;
    });

    return monthlyData;
  };

  // Contributions Chart
  const processContributionsData = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();
    
    // Get number of days in current month
    const lastDay = new Date(Date.UTC(currentYear, currentMonth + 1, 0));
    const daysInMonth = lastDay.getUTCDate();
    
    // Initialize array for daily contributions
    const contributions = Array(daysInMonth).fill(0);
  
    events.forEach((event) => {
      if (event.type === "PushEvent") {
        const eventDate = new Date(event.created_at);
        const eventYear = eventDate.getUTCFullYear();
        const eventMonth = eventDate.getUTCMonth();
        const eventDay = eventDate.getUTCDate();
  
        if (eventYear === currentYear && eventMonth === currentMonth) {
          contributions[eventDay - 1] += 1; // Adjust for zero-based index
        }
      }
    });
  
    return contributions;
  };
  // Languages Data
  const processLanguageData = () => {
    const languageMap = repos.reduce((acc, repo) => {
      if (repo.languages) {
        Object.entries(repo.languages).forEach(([lang, bytes]) => {
          acc.set(lang, (acc.get(lang) || 0) + bytes);
        });
      }
      return acc;
    }, new Map<string, number>());

    return Array.from(languageMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);
  };

  const calculateTotalContributions = () => {
    return events.filter(event => event.type === "PushEvent").length;
  };

  // Chart data and options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    scales: {
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.8)" },
      },
      y: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "rgba(255, 255, 255, 0.8)" },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "rgba(255, 255, 255, 0.8)" },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "rgba(255, 255, 255, 0.8)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
      },
    },
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: { color: "rgba(255, 255, 255, 0.8)" },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "rgba(255, 255, 255, 0.8)",
        bodyColor: "rgba(255, 255, 255, 0.8)",
      },
    },
  };

  const mainChartData = {
    labels: months,
    datasets: [
      {
        label: "Stars",
        data: processMainChartData().map((d) => d.stars),
        borderColor: "rgba(255, 159, 64, 1)",
        tension: 0.4,
      },
      {
        label: "Forks",
        data: processMainChartData().map((d) => d.forks),
        borderColor: "rgba(153, 102, 255, 1)",
        tension: 0.4,
      },
      {
        label: "Issues",
        data: processMainChartData().map((d) => d.issues),
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const contributionsChartData = {
    labels: Array.from({ length: processContributionsData().length }, (_, i) => (i + 1).toString()),
    datasets: [
      {
        label: `Daily Contributions (Push Events) - ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        data: processContributionsData(),
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const languageData = processLanguageData();
  const donutChartData = {
    labels: languageData.map(([lang]) => lang),
    datasets: [
      {
        label: "Language Usage (bytes)",
        data: languageData.map(([, bytes]) => bytes),
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)",
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="text-white text-center">Loading GitHub data...</div>;
  if (error) return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="flex  flex-col items-center justify-center p-4 lg:px-9 gap-6">
     <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
        {/* Line Chart Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
          <h2 className="text-white text-lg font-semibold mb-4">Contributions Over Time</h2>
          <div className="h-96">
            <Line data={contributionsChartData} options={chartOptions} />
          </div>
        </div>

        {/* Doughnut Chart Card */}
        <div className="bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
          <h2 className="text-white text-lg font-semibold mb-4">Most Used Languages</h2>
          <div className="h-96">
            <Doughnut data={donutChartData} options={donutOptions} />
          </div>
        </div>
      </div>

      <div className="w-full bg-black/60 backdrop-blur-md rounded-xl shadow-xl p-6 border border-white/20">
        {/* Main Chart */}
        <div className="h-96">
          <Line data={mainChartData} options={chartOptions} />
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mt-6">
          <StatCard
            label="Total Repositories"
            value={userData?.public_repos || 0}
          />
          <StatCard
            label="Total Stars"
            value={repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
          />
          <StatCard
            label="Total Forks"
            value={repos.reduce((acc, repo) => acc + repo.forks_count, 0)}
          />
          <StatCard
            label="Open Issues"
            value={repos.reduce((acc, repo) => acc + repo.open_issues_count, 0)}
          />
          <StatCard
            label="Total Contributions"
            value={calculateTotalContributions()}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-black/30 p-4 rounded-lg border border-white/10">
    <div className="text-gray-300 text-sm">{label}</div>
    <div className="text-2xl font-bold text-white mt-2">{value}</div>
  </div>
);

export default GitHubStats;