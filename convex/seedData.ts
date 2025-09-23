import { mutation } from "./_generated/server";

export const seedMoviesAndTheaters = mutation({
  args: {},
  handler: async (ctx) => {
    // Add sample theaters
    const theater1 = await ctx.db.insert("theaters", {
      name: "PVR Cinemas",
      location: "Select City Walk, Saket, New Delhi",
      totalSeats: 100,
    });
    
    const theater2 = await ctx.db.insert("theaters", {
      name: "INOX Multiplex",
      location: "Phoenix MarketCity, Kurla, Mumbai",
      totalSeats: 150,
    });

    const theater3 = await ctx.db.insert("theaters", {
      name: "Cinepolis",
      location: "Forum Mall, Koramangala, Bangalore",
      totalSeats: 200,
    });

    const theater4 = await ctx.db.insert("theaters", {
      name: "Carnival Cinemas",
      location: "Express Avenue, Chennai",
      totalSeats: 120,
    });

    const theater5 = await ctx.db.insert("theaters", {
      name: "Miraj Cinemas",
      location: "Seasons Mall, Pune",
      totalSeats: 180,
    });
    
    // Action Movies (5)
    const actionMovies = [
      {
        title: "Fast Chase",
        description: "High-octane action sequences and death-defying stunts in this adrenaline-pumping thriller.",
        genre: "Action",
        duration: 128,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
        releaseDate: "2024-02-10",
        isActive: true,
      },
      {
        title: "Steel Thunder",
        description: "An elite special forces team must stop a terrorist plot that threatens global security.",
        genre: "Action",
        duration: 142,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-01-28",
        isActive: true,
      },
      {
        title: "Night Warrior",
        description: "A vigilante fights crime in the shadows of a corrupt city using advanced technology.",
        genre: "Action",
        duration: 135,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-02-05",
        isActive: true,
      },
      {
        title: "Explosive Dawn",
        description: "When a military base is compromised, one soldier must fight his way out against impossible odds.",
        genre: "Action",
        duration: 118,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
        releaseDate: "2024-01-22",
        isActive: true,
      },
      {
        title: "Code Red",
        description: "A cyber-warfare expert races against time to prevent a digital apocalypse.",
        genre: "Action",
        duration: 125,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        releaseDate: "2024-02-15",
        isActive: true,
      }
    ];

    // Adventure Movies (5)
    const adventureMovies = [
      {
        title: "The Adventure Begins",
        description: "An epic adventure that takes you on a journey through mystical lands filled with danger and wonder.",
        genre: "Adventure",
        duration: 142,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-01-15",
        isActive: true,
      },
      {
        title: "Lost Kingdom",
        description: "Explorers discover an ancient civilization hidden deep in the Amazon rainforest.",
        genre: "Adventure",
        duration: 156,
        rating: "U",
        posterUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
        releaseDate: "2024-01-20",
        isActive: true,
      },
      {
        title: "Mountain Quest",
        description: "A team of climbers faces deadly challenges while attempting to conquer an uncharted peak.",
        genre: "Adventure",
        duration: 134,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        releaseDate: "2024-02-01",
        isActive: true,
      },
      {
        title: "Ocean's Edge",
        description: "Deep-sea treasure hunters encounter mysterious creatures in the ocean's darkest depths.",
        genre: "Adventure",
        duration: 128,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
        releaseDate: "2024-01-25",
        isActive: true,
      },
      {
        title: "Desert Storm",
        description: "Survivors of a plane crash must navigate the harsh desert while being hunted by mercenaries.",
        genre: "Adventure",
        duration: 145,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-02-08",
        isActive: true,
      }
    ];

    // Comedy Movies (5)
    const comedyMovies = [
      {
        title: "Comedy Central",
        description: "A hilarious comedy that will keep you laughing from start to finish with its witty dialogue and perfect timing.",
        genre: "Comedy",
        duration: 98,
        rating: "U",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-01-20",
        isActive: true,
      },
      {
        title: "Laugh Out Loud",
        description: "A group of friends embark on a road trip that turns into the most ridiculous adventure ever.",
        genre: "Comedy",
        duration: 105,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-01-18",
        isActive: true,
      },
      {
        title: "Office Chaos",
        description: "When a new boss takes over, the workplace becomes a battleground of pranks and mishaps.",
        genre: "Comedy",
        duration: 92,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
        releaseDate: "2024-02-12",
        isActive: true,
      },
      {
        title: "Wedding Crashers 2",
        description: "The ultimate wedding crashers return for more romantic chaos and hilarious misunderstandings.",
        genre: "Comedy",
        duration: 115,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        releaseDate: "2024-02-14",
        isActive: true,
      },
      {
        title: "Family Reunion",
        description: "A dysfunctional family gathering turns into a comedy of errors when secrets are revealed.",
        genre: "Comedy",
        duration: 108,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        releaseDate: "2024-01-30",
        isActive: true,
      }
    ];

    // Horror Movies (5)
    const horrorMovies = [
      {
        title: "Midnight Terror",
        description: "A spine-chilling horror experience that will keep you on the edge of your seat with supernatural scares.",
        genre: "Horror",
        duration: 105,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        releaseDate: "2024-01-25",
        isActive: true,
      },
      {
        title: "The Haunting",
        description: "A family moves into a house with a dark past, only to discover they're not alone.",
        genre: "Horror",
        duration: 112,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
        releaseDate: "2024-01-31",
        isActive: true,
      },
      {
        title: "Nightmare Forest",
        description: "Campers in a remote forest encounter an ancient evil that feeds on fear.",
        genre: "Horror",
        duration: 98,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-02-07",
        isActive: true,
      },
      {
        title: "Blood Moon",
        description: "During a lunar eclipse, a small town becomes the hunting ground for supernatural creatures.",
        genre: "Horror",
        duration: 125,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-02-13",
        isActive: true,
      },
      {
        title: "The Possession",
        description: "An antique music box unleashes a malevolent spirit that terrorizes a young girl and her family.",
        genre: "Horror",
        duration: 103,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
        releaseDate: "2024-01-28",
        isActive: true,
      }
    ];

    // Romance Movies (5)
    const romanceMovies = [
      {
        title: "Love in Paris",
        description: "A romantic tale of two souls finding each other in the city of love, filled with passion and heartbreak.",
        genre: "Romance",
        duration: 118,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        releaseDate: "2024-02-14",
        isActive: true,
      },
      {
        title: "Second Chances",
        description: "Two former lovers reunite after years apart, discovering if their love can survive the test of time.",
        genre: "Romance",
        duration: 125,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
        releaseDate: "2024-02-10",
        isActive: true,
      },
      {
        title: "Summer Romance",
        description: "A chance encounter at a beach resort leads to an unexpected summer love story.",
        genre: "Romance",
        duration: 102,
        rating: "U",
        posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        releaseDate: "2024-01-26",
        isActive: true,
      },
      {
        title: "The Wedding Planner",
        description: "A successful wedding planner falls for the groom of her biggest client, creating romantic chaos.",
        genre: "Romance",
        duration: 108,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-02-16",
        isActive: true,
      },
      {
        title: "Letters to You",
        description: "A woman discovers love letters in an old house and sets out to find their mysterious author.",
        genre: "Romance",
        duration: 115,
        rating: "U",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-02-12",
        isActive: true,
      }
    ];

    // Sci-Fi Movies (5)
    const sciFiMovies = [
      {
        title: "Space Odyssey 2024",
        description: "A thrilling sci-fi adventure that explores the mysteries of deep space and humanity's future.",
        genre: "Sci-Fi",
        duration: 156,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
        releaseDate: "2024-02-01",
        isActive: true,
      },
      {
        title: "Quantum Leap",
        description: "Scientists discover a way to travel through parallel dimensions, but at what cost?",
        genre: "Sci-Fi",
        duration: 142,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
        releaseDate: "2024-01-24",
        isActive: true,
      },
      {
        title: "AI Revolution",
        description: "When artificial intelligence becomes sentient, humanity must fight for its survival.",
        genre: "Sci-Fi",
        duration: 138,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        releaseDate: "2024-02-06",
        isActive: true,
      },
      {
        title: "Mars Colony",
        description: "The first human settlement on Mars faces unexpected challenges that threaten their survival.",
        genre: "Sci-Fi",
        duration: 148,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=600&fit=crop",
        releaseDate: "2024-01-29",
        isActive: true,
      },
      {
        title: "Time Paradox",
        description: "A time traveler accidentally creates a paradox that threatens to unravel reality itself.",
        genre: "Sci-Fi",
        duration: 132,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&h=600&fit=crop",
        releaseDate: "2024-02-11",
        isActive: true,
      }
    ];

    // Drama Movies (5)
    const dramaMovies = [
      {
        title: "The Great Heist",
        description: "A masterfully crafted drama about family, loyalty, and the choices that define us.",
        genre: "Drama",
        duration: 134,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop",
        releaseDate: "2024-01-30",
        isActive: true,
      },
      {
        title: "Broken Dreams",
        description: "A struggling artist must choose between his passion and providing for his family.",
        genre: "Drama",
        duration: 128,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1489599735734-79b4169c4388?w=400&h=600&fit=crop",
        releaseDate: "2024-01-27",
        isActive: true,
      },
      {
        title: "The Last Stand",
        description: "A veteran teacher fights to save his inner-city school from closure.",
        genre: "Drama",
        duration: 145,
        rating: "U/A 13+",
        posterUrl: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=600&fit=crop",
        releaseDate: "2024-02-03",
        isActive: true,
      },
      {
        title: "Mother's Love",
        description: "A mother's unwavering dedication to her disabled son inspires an entire community.",
        genre: "Drama",
        duration: 122,
        rating: "U",
        posterUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop",
        releaseDate: "2024-02-09",
        isActive: true,
      },
      {
        title: "The Verdict",
        description: "A young lawyer takes on a case that could expose corruption at the highest levels of government.",
        genre: "Drama",
        duration: 152,
        rating: "A",
        posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop",
        releaseDate: "2024-01-23",
        isActive: true,
      }
    ];

    // Insert all movies
    const allMovies = [
      ...actionMovies,
      ...adventureMovies,
      ...comedyMovies,
      ...horrorMovies,
      ...romanceMovies,
      ...sciFiMovies,
      ...dramaMovies
    ];

    const movieIds = [];
    for (const movie of allMovies) {
      const movieId = await ctx.db.insert("movies", movie);
      movieIds.push(movieId);
    }
    
    // Add sample showtimes with Indian pricing
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dayAfter = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const theaters = [theater1, theater2, theater3, theater4, theater5];
    const times = ["14:00", "16:30", "19:00", "21:30"];
    const prices = [199, 249, 299, 349, 399]; // Indian Rupees
    
    // Create showtimes for popular movies (first 15 movies get more showtimes)
    for (let i = 0; i < Math.min(15, movieIds.length); i++) {
      const movieId = movieIds[i];
      
      // Today's showtimes
      for (let j = 0; j < 2; j++) {
        const theater = theaters[j % theaters.length];
        const theaterSeats = theater === theater1 ? 100 : theater === theater2 ? 150 : theater === theater3 ? 200 : theater === theater4 ? 120 : 180;
        
        await ctx.db.insert("showtimes", {
          movieId,
          theaterId: theater,
          showDate: today,
          showTime: times[j % times.length],
          price: prices[j % prices.length],
          availableSeats: theaterSeats,
        });
      }
      
      // Tomorrow's showtimes
      for (let j = 0; j < 2; j++) {
        const theater = theaters[(j + 2) % theaters.length];
        const theaterSeats = theater === theater1 ? 100 : theater === theater2 ? 150 : theater === theater3 ? 200 : theater === theater4 ? 120 : 180;
        
        await ctx.db.insert("showtimes", {
          movieId,
          theaterId: theater,
          showDate: tomorrow,
          showTime: times[(j + 2) % times.length],
          price: prices[(j + 1) % prices.length],
          availableSeats: theaterSeats,
        });
      }
      
      // Day after tomorrow's showtimes
      if (i < 10) { // Only for top 10 movies
        const theater = theaters[i % theaters.length];
        const theaterSeats = theater === theater1 ? 100 : theater === theater2 ? 150 : theater === theater3 ? 200 : theater === theater4 ? 120 : 180;
        
        await ctx.db.insert("showtimes", {
          movieId,
          theaterId: theater,
          showDate: dayAfter,
          showTime: times[i % times.length],
          price: prices[i % prices.length],
          availableSeats: theaterSeats,
        });
      }
    }
    
    return "Sample data seeded successfully with 35 movies across 7 genres with Indian pricing!";
  },
});
