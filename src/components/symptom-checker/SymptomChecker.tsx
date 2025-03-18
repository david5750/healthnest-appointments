
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Loader2, Send, BrainCircuit, AlertTriangle } from "lucide-react";

interface Recommendation {
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
}

interface SymptomResponse {
  possibleConditions: string[];
  recommendations: Recommendation[];
  disclaimer: string;
}

// Mock AI response function
const mockGetSymptomAnalysis = async (symptoms: string): Promise<SymptomResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Simple keyword matching for the demo
  const symptomsLower = symptoms.toLowerCase();
  
  // Default response
  const response: SymptomResponse = {
    possibleConditions: ["Common cold", "Allergies"],
    recommendations: [
      {
        title: "Rest and hydration",
        description: "Make sure to get plenty of rest and stay well-hydrated.",
        severity: "low"
      },
      {
        title: "Over-the-counter medication",
        description: "Consider over-the-counter pain relievers and decongestants to manage symptoms.",
        severity: "low"
      }
    ],
    disclaimer: "This is not a medical diagnosis. Please consult with a healthcare professional for proper medical advice."
  };
  
  // Customize based on symptoms
  if (symptomsLower.includes("headache") || symptomsLower.includes("head pain")) {
    response.possibleConditions = ["Tension headache", "Migraine", "Dehydration"];
    response.recommendations = [
      {
        title: "Rest in a quiet, dark room",
        description: "Reduce exposure to light and sound, which may aggravate headaches.",
        severity: "medium"
      },
      {
        title: "Stay hydrated",
        description: "Drink plenty of water, as dehydration can cause headaches.",
        severity: "low"
      },
      {
        title: "Consult a doctor if persistent",
        description: "If headaches are severe, persistent, or accompanied by other symptoms, seek medical advice.",
        severity: "medium"
      }
    ];
  } else if (symptomsLower.includes("fever") || symptomsLower.includes("high temperature")) {
    response.possibleConditions = ["Common cold", "Flu", "Infection"];
    response.recommendations = [
      {
        title: "Rest and monitor temperature",
        description: "Get plenty of rest and regularly monitor your temperature.",
        severity: "medium"
      },
      {
        title: "Stay hydrated",
        description: "Drink plenty of fluids to prevent dehydration.",
        severity: "medium"
      },
      {
        title: "Seek medical attention for high fever",
        description: "For temperatures above 103°F (39.4°C) or fever lasting more than three days, consult a healthcare provider.",
        severity: "high"
      }
    ];
  } else if (symptomsLower.includes("cough") || symptomsLower.includes("sore throat")) {
    response.possibleConditions = ["Common cold", "Flu", "Strep throat", "COVID-19"];
    response.recommendations = [
      {
        title: "Rest and fluids",
        description: "Get plenty of rest and stay hydrated with warm liquids.",
        severity: "low"
      },
      {
        title: "Consider testing",
        description: "If symptoms persist or worsen, consider getting tested for strep throat or COVID-19.",
        severity: "medium"
      },
      {
        title: "Over-the-counter remedies",
        description: "Throat lozenges or warm salt water gargles may provide relief.",
        severity: "low"
      }
    ];
  }
  
  return response;
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200";
    case "medium":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "high":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [analysis, setAnalysis] = useState<SymptomResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symptoms.trim()) {
      setError("Please describe your symptoms before submitting.");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    
    try {
      const response = await mockGetSymptomAnalysis(symptoms);
      setAnalysis(response);
    } catch (err) {
      console.error(err);
      setError("An error occurred while analyzing your symptoms. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSymptoms("");
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in p-4">
      <Card className="border-none shadow-soft bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold flex items-center">
            <BrainCircuit className="h-6 w-6 text-primary mr-2" />
            AI Symptom Checker
          </CardTitle>
          <CardDescription>
            Describe your symptoms in detail to get AI-powered insights
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {!analysis ? (
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe your symptoms in detail. For example: I've had a headache for the past 3 days, along with a mild fever and sore throat."
                  className="min-h-[150px] text-base resize-none"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  disabled={isAnalyzing}
                />
                
                <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription className="text-sm">
                    This tool provides general guidance based on your symptoms, but it is not a substitute 
                    for professional medical advice, diagnosis, or treatment. Always consult with a qualified 
                    healthcare provider.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-medium mb-2">Possible Conditions</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {analysis.possibleConditions.map((condition, index) => (
                      <li key={index} className="text-gray-700">{condition}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Recommendations</h3>
                  <div className="space-y-3">
                    {analysis.recommendations.map((rec, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-lg border ${getSeverityColor(rec.severity)}`}
                      >
                        <h4 className="font-medium">
                          {rec.title}
                          {rec.severity === "high" && (
                            <span className="inline-flex items-center ml-2">
                              <AlertTriangle className="h-4 w-4 mr-1" /> Important
                            </span>
                          )}
                        </h4>
                        <p className="text-sm mt-1">{rec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Disclaimer</AlertTitle>
                  <AlertDescription className="text-sm">
                    {analysis.disclaimer}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end space-x-2">
            {analysis ? (
              <>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                >
                  Start Over
                </Button>
                <Button asChild>
                  <a href="/find-doctors">Consult a Doctor</a>
                </Button>
              </>
            ) : (
              <Button 
                type="submit" 
                disabled={isAnalyzing || !symptoms.trim()}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SymptomChecker;
