import { useEffect, useState } from "react";
import { Doughnut, Bar, Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement
);

interface GitHubUser {
  public_repos: number;
}

interface GitHubRepo {
  stargazers_count: number;
  language: string | null;
  forks_count: number;
  open_issues_count: number;
  name: string;
}

interface UserStats {
  stars: number;
  issues: number;
  contributions: number;
  forks: number;
  commits: number;
}

interface TopLanguages {
  [key: string]: number;
}
const topLangsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };
  const userStatsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };
  const repoForksOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };
  const starsOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };
  const issuesByRepoOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };
  const commitsOverTimeOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // Optional: Adjust grid color
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "rgba(255, 255, 255, 0.8)", // White with 80% opacity
        },
      },
    },
  };

const GitHubStats = () => {


  
  const [topLanguages, setTopLanguages] = useState<TopLanguages>({});
  const [userStats, setUserStats] = useState<UserStats>({
    stars: 0,
    issues: 0,
    contributions: 0,
    forks: 0,
    commits: 0,
  });
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME;
        const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

        if (!username || !token) {
          throw new Error("GitHub username or token is missing in the environment variables.");
        }

        const headers = {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        };

        // Fetch user profile
        const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData: GitHubUser = await userResponse.json();

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, { headers });
        if (!reposResponse.ok) throw new Error("Failed to fetch repositories");
        const repos: GitHubRepo[] = await reposResponse.json();

        // Calculate total stars, forks, and issues
        const stars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const forks = repos.reduce((acc, repo) => acc + repo.forks_count, 0);
        const issues = repos.reduce((acc, repo) => acc + repo.open_issues_count, 0);

        // Calculate top languages
        const langMap: TopLanguages = {};
        repos.forEach((repo) => {
          if (repo.language) {
            langMap[repo.language] = (langMap[repo.language] || 0) + 1;
          }
        });

        // Set user stats
        setUserStats({
          stars,
          issues,
          contributions: userData.public_repos * 10, // Approximate contributions
          forks,
          commits: userData.public_repos * 20, // Approximate commits
        });

        // Set top languages
        setTopLanguages(langMap);

        // Set repositories
        setRepos(repos);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Top Languages Chart Data
  const topLangsData = {
    labels: Object.keys(topLanguages),
    datasets: [
      {
        label: "Top Languages",
        data: Object.values(topLanguages),
        backgroundColor: ["rgba(255, 99, 132, 0.2)", "rgba(54, 162, 235, 0.2)", "rgba(255, 206, 86, 0.2)"],
        borderColor: ["rgba(255, 99, 132, 1)", "rgba(54, 162, 235, 1)", "rgba(255, 206, 86, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // User Stats Chart Data
  const userStatsData = {
    labels: ["Stars", "Issues", "Contributions", "Forks", "Commits"],
    datasets: [
      {
        label: "User Stats",
        data: [userStats.stars, userStats.issues, userStats.contributions, userStats.forks, userStats.commits],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Repository Forks Chart Data
  const repoForksData = {
    labels: repos.slice(0, 10).map((repo) => repo.name), // Top 10 repositories by forks
    datasets: [
      {
        label: "Forks",
        data: repos.slice(0, 10).map((repo) => repo.forks_count),
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Stars Over Time Chart Data (Simulated)
  const starsOverTimeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Stars Over Time",
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120], // Simulated data
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  // Issues by Repository Chart Data
  const issuesByRepoData = {
    labels: repos.slice(0, 10).map((repo) => repo.name), // Top 10 repositories by issues
    datasets: [
      {
        label: "Open Issues",
        data: repos.slice(0, 10).map((repo) => repo.open_issues_count),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Commits Over Time Chart Data (Simulated)
  const commitsOverTimeData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Commits Over Time",
        data: [5, 15, 25, 35, 45, 55, 65, 75, 85, 95, 105, 115], // Simulated data
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: false,
      },
    ],
  };

 return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 sm:p-6 md:p-8 lg:p-10">
    {/* Top Languages Chart */}
    <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Top Languages</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Doughnut data={topLangsData} options={topLangsOptions} />
      </div>
    </div>

    {/* User Stats Chart */}
    <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">User Stats</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Bar data={userStatsData} options={userStatsOptions} />
      </div>
    </div>

    {/* Repository Forks Chart */}
    <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg hidden sm:block border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Repository Forks</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Bar data={repoForksData} options={repoForksOptions} />
      </div>
    </div>

    {/* Stars Over Time Chart */}
    <div className="bg-black/50 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Stars Over Time</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Line data={starsOverTimeData} options={starsOverTimeOptions} />
      </div>
    </div>

    {/* Issues by Repository Chart */}
    <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Issues by Repository</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Bar data={issuesByRepoData} options={issuesByRepoOptions} />
      </div>
    </div>

    {/* Commits Over Time Chart */}
    <div className="bg-black/60 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-lg border-[0.5px] border-white/40">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-white">Commits Over Time</h2>
      <div className="w-full h-64 sm:h-80 md:h-96">
        <Line data={commitsOverTimeData} options={commitsOverTimeOptions} />
      </div>
    </div>
  </div>
);
};

export default GitHubStats;