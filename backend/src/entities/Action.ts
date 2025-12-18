// src/entities/Action.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Goal } from './Goal';

@Entity()
export class Action {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('date')
    start_date: string;

    @Column('date')
    end_date: string;

    @Column()
    interval: string;

    @Column({ default: 'pending' })
    status: string;

    @ManyToOne(() => Goal, goal => goal.actions, {
        onDelete: 'CASCADE' // If a goal is deleted, actions are also deleted
    })
    goal: Goal;
}