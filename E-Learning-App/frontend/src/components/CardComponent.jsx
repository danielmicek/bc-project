import React from "react";
import {Button, Card, CardBody} from "@heroui/react";

export default function CardComponent({
                                          type,
                                          description,
                                          difficulty,
                                          questions,
                                          time,
                                          imgSrc,
                                          testColumn,
                                          onStart,
                                          onDetails,
                                      }) {
    const difficultyStyles = {
        None: "bg-white text-black border-gray-300",
        Easy: "bg-green-100 text-green-700 border-green-300",
        Medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
        Hard: "bg-red-100 text-red-700 border-red-300",
    };
    const title = type === "Learning" ? "Learn for tests" : type + " test"

    return (
        <Card className={`w-full h-border ${testColumn} testColumnCommon !shadow-[5px_10px_30px_rgba(252,147,40,0.5)] flex min-[900px]:flex-row max-[900px]:justify-center max-[900px]:pt-5 max-[480px]:px-3 flex-col items-center min-[900px]:flex-row h-fit mt-[50px] pb-5 rounded-lg bg-gradient-to-br from-[#2a2a2a] to-[#1f1f1f] border-2 border-[var(--main-color-orange)] relative`}>
            <CardBody className="p-5">
                {/* HEADER */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        {/* MEDAL IMAGE */}
                        <img
                            src={imgSrc}
                            alt={`${difficulty} medal`}
                            className="object-contain mt-3 w-[60px] h-[60px]"
                            style={{ marginTop: type === "Learning" ? "0" : "10px" }}
                        />

                        <div>
                            <h3 className="text-2xl font-semibold text-foreground text-white">
                                {title}
                            </h3>
                            <p className="text-md text-foreground/70 text-gray-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    {/* DIFFICULTY BADGE */}
                    <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold
            ${difficultyStyles[difficulty]}`}
                    >
            {difficulty}
          </span>
                </div>

                {/* META INFO */}
                <div className="mt-4 flex gap-4 text-sm text-foreground/70">
                  <span>
                    <b className="text-foreground text-gray-400">{questions === 0 ? "" : `${questions} questions`}</b>
                  </span>
                            <span>
                    <b className="text-foreground text-gray-400">{time === 0 ? "Unlimited time" : `${time} min`}</b>
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="mt-5 flex justify-end gap-2">
                    <Button variant="light" className="bg-gray-500 font-bold" onPress={onDetails}>
                        Details
                    </Button>
                    <Button variant="light" className="bg-[var(--main-color-orange)] font-bold" onPress={onStart}>
                        Start test
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
