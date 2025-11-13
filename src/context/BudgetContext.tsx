import React, { createContext, useContext, useState, useEffect } from 'react';

interface BudgetSettings {
  likesRequired: number;
  repostsRequired: number;
  followsRequired: number;
  initialBudget: number;
  postsPerLike: number;
  postsPerRepost: number;
  postsPerFollow: number;
}

interface BudgetState {
  postsViewed: number;
  postsRemaining: number;
  likesGiven: number;
  repostsGiven: number;
  followsGiven: number;
  settings: BudgetSettings;
}

interface BudgetContextType {
  budgetState: BudgetState;
  updateSettings: (newSettings: Partial<BudgetSettings>) => void;
  recordLike: () => void;
  recordRepost: () => void;
  recordFollow: () => void;
  viewPost: () => void;
  resetBudget: () => void;
  canViewMorePosts: boolean;
}

const defaultSettings: BudgetSettings = {
  likesRequired: 5,
  repostsRequired: 2,
  followsRequired: 1,
  initialBudget: 10,
  postsPerLike: 3,
  postsPerRepost: 5,
  postsPerFollow: 10,
};

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BudgetSettings>(() => {
    const saved = localStorage.getItem('antiLurkSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [budgetState, setBudgetState] = useState<BudgetState>(() => {
    const saved = localStorage.getItem('antiLurkBudget');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      postsViewed: 0,
      postsRemaining: settings.initialBudget,
      likesGiven: 0,
      repostsGiven: 0,
      followsGiven: 0,
      settings,
    };
  });

  useEffect(() => {
    localStorage.setItem('antiLurkSettings', JSON.stringify(settings));
    setBudgetState(prev => ({ ...prev, settings }));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('antiLurkBudget', JSON.stringify(budgetState));
  }, [budgetState]);

  const updateSettings = (newSettings: Partial<BudgetSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const recordLike = () => {
    setBudgetState(prev => ({
      ...prev,
      likesGiven: prev.likesGiven + 1,
      postsRemaining: prev.postsRemaining + settings.postsPerLike,
    }));
  };

  const recordRepost = () => {
    setBudgetState(prev => ({
      ...prev,
      repostsGiven: prev.repostsGiven + 1,
      postsRemaining: prev.postsRemaining + settings.postsPerRepost,
    }));
  };

  const recordFollow = () => {
    setBudgetState(prev => ({
      ...prev,
      followsGiven: prev.followsGiven + 1,
      postsRemaining: prev.postsRemaining + settings.postsPerFollow,
    }));
  };

  const viewPost = () => {
    setBudgetState(prev => ({
      ...prev,
      postsViewed: prev.postsViewed + 1,
      postsRemaining: Math.max(0, prev.postsRemaining - 1),
    }));
  };

  const resetBudget = () => {
    setBudgetState({
      postsViewed: 0,
      postsRemaining: settings.initialBudget,
      likesGiven: 0,
      repostsGiven: 0,
      followsGiven: 0,
      settings,
    });
  };

  const canViewMorePosts = budgetState.postsRemaining > 0;

  return (
    <BudgetContext.Provider
      value={{
        budgetState,
        updateSettings,
        recordLike,
        recordRepost,
        recordFollow,
        viewPost,
        resetBudget,
        canViewMorePosts,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
};
