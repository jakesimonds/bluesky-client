# Goals for this project: 
- create a roll-your-own social media client that uses existing stuff and lets us experiment with UI and such
- developer is a JUNIOR DEV, wants to LEARN so always explain everything


# Eventual goals (to keep in mind)
- eventaully want this to be app too so thinking react native
- 


# Development Workflow

## How We're Working

### Claude (AI Assistant)
- Works in the remote environment `/home/user/bluesky-client`
- Makes code changes
- Can run builds and tests in the remote environment

### You (Developer)
- Working on your local machine
- Pull down changes
- Run the dev server locally: `npm run dev`
- Test in your local browser
- Report back what you see/errors you get

## Current Workflow

1. **Claude makes changes** → commits → pushes to branch
2. **You run:** `git pull` on your local machine
3. **You run:** `npm run dev` to start local server
4. **You test** in browser at `http://localhost:3000`
5. **You report** what happens (errors, behavior, console logs)
6. **Claude adjusts** based on your feedback
7. Repeat until it works!

## Important Notes

- **If `git pull` says "already up to date"** - you have the latest code
- **After pulling, you may need to:** run `npm install` if dependencies changed
- **Browser cache issues:** Try hard refresh (`Ctrl+F5` or `Cmd+Shift+R`)
- **Check browser console:** Open DevTools (F12) → Console tab for errors
- **Check terminal:** Look for errors in the `npm run dev` output

## Current Status

- Oauth given up on, we eventually want but sticking with app password for now

## Common Issues

### "Already up to date" but still has issues
- The code is correct on the branch
- Issue might be in browser cache or npm packages
- Try:
  ```bash
  npm install        # Reinstall dependencies
  npm run dev        # Restart server
  # Hard refresh browser (Ctrl+F5)
  ```

### Network errors
- Check if `npm run dev` is actually running
- Check the port (should be 3000)
- Try `http://127.0.0.1:3000` instead of `localhost:3000`

