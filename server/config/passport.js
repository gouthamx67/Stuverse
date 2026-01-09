import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import User from '../models/User.js';


passport.serializeUser((user, done) => {
    done(null, user._id);
});


passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});


if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.GOOGLE_CALLBACK_URL || '/api/auth/google/callback',
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ googleId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        user.googleId = profile.id;
                        await user.save();
                        return done(null, user);
                    }

                    user = await User.create({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: profile.photos[0]?.value,
                        university: 'Unspecified',
                        authProvider: 'google',
                    });

                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
}


if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
    passport.use(
        new MicrosoftStrategy(
            {
                clientID: process.env.MICROSOFT_CLIENT_ID,
                clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
                callbackURL: process.env.MICROSOFT_CALLBACK_URL || '/api/auth/microsoft/callback',
                scope: ['user.read'],
                proxy: true,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await User.findOne({ microsoftId: profile.id });

                    if (user) {
                        return done(null, user);
                    }

                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        user.microsoftId = profile.id;
                        await user.save();
                        return done(null, user);
                    }

                    user = await User.create({
                        microsoftId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        avatar: '',
                        university: 'Unspecified',
                        authProvider: 'microsoft',
                    });

                    done(null, user);
                } catch (error) {
                    done(error, null);
                }
            }
        )
    );
}


export default passport;
