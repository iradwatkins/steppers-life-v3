-- Create user_profiles table first
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(255),
    email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending_approval' CHECK (status IN ('active', 'pending_approval', 'suspended', 'deactivated')),
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_login TIMESTAMP WITH TIME ZONE,
    vod_subscription_status VARCHAR(50) CHECK (vod_subscription_status IN ('active', 'inactive', 'trialing')),
    contact_phone VARCHAR(50),
    address TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create user_roles table with reference to user_profiles
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('buyer', 'organizer', 'instructor', 'admin', 'event_staff', 'sales_agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_profile_id ON user_roles(profile_id);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop old policies to avoid conflicts from previous migration attempts
DROP POLICY IF EXISTS "Allow admins full access to user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow user to see their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow admins to modify user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow admins full access to user_profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow user to manage their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow user to update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Allow admins to delete profiles" ON public.user_profiles;

-- Create a helper function to safely check for admin role and avoid recursion.
-- This function runs with the privileges of the user who defined it (the superuser), bypassing RLS for the check itself.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- POLICIES FOR user_roles
-- SELECT: Allow any authenticated user to read roles. This is needed for other policies to check admin status without recursion.
CREATE POLICY "Allow authenticated users to read roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- ALL (INSERT, UPDATE, DELETE): Only allow admins to change roles.
CREATE POLICY "Allow admins to modify user_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());


-- POLICIES FOR user_profiles
-- SELECT: Users can view their own profile. Admins can view all profiles.
CREATE POLICY "Allow user to manage their own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (
    (user_id = auth.uid()) OR
    (public.is_admin())
);

-- UPDATE: Users can update their own profile. Admins can update all profiles.
CREATE POLICY "Allow user to update their own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (
    (user_id = auth.uid()) OR
    (public.is_admin())
)
WITH CHECK (
    (user_id = auth.uid()) OR
    (public.is_admin())
);

-- DELETE: Only Admins can delete profiles.
CREATE POLICY "Allow admins to delete profiles"
ON public.user_profiles
FOR DELETE
TO authenticated
USING (
    public.is_admin()
);

-- INSERT for user_profiles is handled by the handle_new_user trigger.

-- Create function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_profile_id UUID;
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (user_id, email, name)
    VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'name', new.email))
    RETURNING id INTO new_profile_id;

    -- Set as buyer by default
    INSERT INTO public.user_roles (user_id, profile_id, role)
    VALUES (new.id, new_profile_id, 'buyer');

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 