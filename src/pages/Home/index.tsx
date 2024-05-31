import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { differenceInSeconds } from "date-fns";


import { 
    CountdownContainer,
    FormContainer,
    HomeContainer,
    MinutesAmountInput,
    Separator,
    StartCountdownButton,
    StopCountdownButton,
    TaskInput
} from "./styles";

const createNewCycleSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
      .number()
      .min(5, 'O ciclo precisa ser de no mínimo 5 minutos.')
      .max(60, 'O ciclo precisa ser de no máximo 60 minutos.'),
})

type CreateNewCycleFormData = zod.infer<typeof createNewCycleSchema>

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptDate?: Date;
    finishedDate?: Date;
}

export function Home() {
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const { register, handleSubmit, watch, reset } = useForm<CreateNewCycleFormData>({
        resolver: zodResolver(createNewCycleSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0,
        }
    });

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    const totalTimeInSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    const audio = useRef(new Audio('src/assets/alarm.wav'));

    useEffect(() => {
        let interval: number;

        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDifference = differenceInSeconds(
                    new Date(),
                    activeCycle.startDate
                );


            if(secondsDifference >= totalTimeInSeconds) {
                setCycles((cycles) => cycles.map(cycle => {
                    if (cycle.id === activeCycleId) {
                        audio.current.play();
                        return {
                            ...cycle,
                            finishedDate: new Date(),
                        }
                    } else {
                        return cycle;
                    }
                }),
            );
                setAmountSecondsPassed(totalTimeInSeconds)

                clearInterval(interval);
            } else {
                setAmountSecondsPassed(secondsDifference)
            }
        }, 1000);
        }
        return () => {
            clearInterval(interval);
        }
    }, [activeCycle, totalTimeInSeconds, activeCycleId]);


    function handleCreateNewCycle(data: CreateNewCycleFormData) {
        const id = String(new Date().getTime());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }

        setCycles((state) => [...state, newCycle]);
        setAmountSecondsPassed(0)
        setActiveCycleId(id);

        reset();
    }

    function handleStopCountdown() {
        setActiveCycleId(null);
        document.title = 'Ignite Timer';

        setCycles((cycles)=> cycles.map(cycle => {
            if (cycle.id === activeCycleId) {
                return {
                   ...cycle,
                    interruptDate: new Date(),
                }
            } else {
                return cycle;
            }

        }))
        audio.current.pause();
        audio.current.currentTime = 0;
    }

    const secondsLeft = activeCycle ? totalTimeInSeconds - amountSecondsPassed : 0;

    const minutesAmount = Math.floor(secondsLeft / 60);
    const secondsAmount = secondsLeft % 60;

    const minutes = String(minutesAmount).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds} - ${activeCycle.task}`
        }
    })

    const task = watch('task')
    const isSubmitDisabled = task

    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task"
                        list="task-suggestions"
                        placeholder="Dê um nome para o seu projeto"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="Limpar a casa" />
                        <option value="Lavar a louça" />
                        <option value="Meditar" />
                        <option value="Estudar" />
                    </datalist>

                    <label htmlFor="minutesAmout">durante</label>
                    <MinutesAmountInput
                        id="minutesAmout"
                        type="number"
                        placeholder="00"
                        min={5}
                        max={60}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>

                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>
                { activeCycle ? (
                    <StopCountdownButton type="button" onClick={handleStopCountdown}>
                    <HandPalm size={24}/>
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton type="submit" disabled={!isSubmitDisabled}>
                        <Play size={24}/>
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}