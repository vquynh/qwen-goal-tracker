-- goals table
CREATE TABLE goals (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       title TEXT NOT NULL,
                       deadline DATE NOT NULL,
                       created_at TIMESTAMP DEFAULT NOW()
);

-- actions table
CREATE TABLE actions (
                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         goal_id UUID REFERENCES goals(id),
                         title TEXT NOT NULL,
                         start_date DATE NOT NULL,
                         end_date DATE NOT NULL,
                         interval TEXT NOT NULL, -- e.g., "daily", "weekly", "monthly"
                         status TEXT NOT NULL DEFAULT 'pending', -- enum: pending, completed, overdue
                         created_at TIMESTAMP DEFAULT NOW()
);