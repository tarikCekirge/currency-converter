import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { data } from "@/data";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react"
import { useDebounce } from 'use-debounce';




const Converter = () => {
    const [currencyValues] = useState(data)
    const [amount, setAmount] = useState<number>(1);
    const [debouncedAmount] = useDebounce(amount, 1000);
    const [fromCur, setFromCur] = useState("EUR")
    const [toCur, setToCur] = useState("USD")
    const [result, setResult] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (fromCur === toCur) {
            setResult(debouncedAmount);
            return;
        }

        if (!debouncedAmount || isNaN(amount) || amount <= 0) return;

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        (async () => {
            try {
                const res = await fetch(
                    `https://api.frankfurter.app/latest?amount=${debouncedAmount}&from=${fromCur}&to=${toCur}`,
                    { signal: controller.signal }
                );
                if (!res.ok) throw new Error("API error");
                const data = await res.json();
                setResult(data.rates[toCur]);
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Conversion failed. Please try again.");
                    setResult(null);
                }
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, [debouncedAmount, fromCur, toCur]);

    return (
        <section className="flex flex-col justify-center max-w-2xl mx-auto bg-muted dark:bg-muted p-4 rounded-md gap-4">
            <div className="flex gap-2 flex-col sm:flex-row">
                <Input
                    className="flex-1 "
                    placeholder="Amount"
                    type="text"
                    disabled={loading}
                    value={amount.toString()}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            setAmount(value === "" ? 0 : Number(value));
                        }
                    }}
                    onKeyDown={(e) => {
                        const allowedKeys = ["Backspace", "ArrowLeft", "ArrowRight", "Tab"];
                        if (
                            !/[0-9]/.test(e.key) &&
                            !allowedKeys.includes(e.key)
                        ) {
                            e.preventDefault();
                        }
                    }}
                />
                <Select value={fromCur} onValueChange={setFromCur} disabled={loading}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="From Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencyValues
                            .filter((currency) => currency.code !== toCur)
                            .map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
                <Select value={toCur} onValueChange={setToCur} disabled={loading}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="To Currency" />
                    </SelectTrigger>
                    <SelectContent>
                        {currencyValues
                            .filter((currency) => currency.code !== fromCur)
                            .map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </SelectItem>
                            ))}
                    </SelectContent>
                </Select>
            </div>
            {loading && debouncedAmount === amount && (
                <p className="text-center text-muted-foreground italic flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" />Converting...</p>
            )}

            {error && (
                <p className="text-center text-red-500">{error}</p>
            )}

            {!loading && !error && result !== null && debouncedAmount > 0 && (
                <p className="text-lg font-semibold text-center">
                    {debouncedAmount} {fromCur} = {result} {toCur}
                </p>
            )}
        </section>
    );
};

export default Converter;
