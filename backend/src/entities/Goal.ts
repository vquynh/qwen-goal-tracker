// src/entities/Goal.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Action } from './Action';

@Entity()
export class Goal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column('date')
    deadline: string;


    @OneToMany(() => Action, action => action.goal, {
        cascade: true, // Enable cascading operations
        onDelete: 'CASCADE' // Ensure related actions are deleted when a goal is deleted
    })
    actions: Action[];
}