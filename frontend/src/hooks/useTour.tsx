import Shepherd from 'shepherd.js';
// import 'shepherd.js/dist/css/shepherd.css';
import { useEffect, useState } from 'react';
import type { Tour } from 'shepherd.js';
import { steps } from '../data/tutorial';

function createStepContent(
  message: string,
  onNext?: () => void,
  onBack?: () => void,
) {
  const container = document.createElement('div');
  container.className = 'custom-popup-wrapper';

  container.innerHTML = `
    <div class="corner-dot corner-top-left"></div>
    <div class="corner-dot corner-top-right"></div>
    <div class="corner-dot corner-bottom-left"></div>
    <div class="corner-dot corner-bottom-right"></div>

    <div class="shepherd-text">${message}</div>

    <div class="shepherd-footer">
      ${onBack ? `<button id="skip-btn" class="bg-gray-700 hover:bg-gray-600 text-white font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200">Back</button>` : ''}
      ${onNext ? `<button id="next-btn" class="bg-yellow-500 hover:bg-yellow-600 text-black font-cinzel font-semibold px-6 py-2 rounded shadow-lg transition duration-200">Next</button>` : ''}
    </div>
  `;

  if (onNext) {
    container.querySelector('#next-btn')?.addEventListener('click', onNext);
  }
  if (onBack) {
    container.querySelector('#skip-btn')?.addEventListener('click', onBack);
  }

  return container;
}
export function useTour({
  onStepChange,
  onComplete,
}: {
  onStepChange?: (stepId: string) => void;
  onComplete?: () => void;
} = {}) {

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tourInstance, setTourInstance] = useState<Tour | null>(null);

    useEffect(() => {
    // Cleanup on unmount
    return () => {
      tourInstance?.cancel();
    };
  }, [tourInstance]);

  const startTour = () => {
    document.body.style.overflow = 'hidden'; 
    const tour = new Shepherd.Tour({
      useModalOverlay: false,
      defaultStepOptions: {
        scrollTo: false,
        cancelIcon: { enabled: false },
        classes: 'custom-shepherd-popup',
        arrow: false,
        buttons: [],
      },
    });

    steps.forEach((step, index) => {
      tour.addStep({
        id: step.id,
        attachTo: { element: step.target, on: step.position },
        text: createStepContent(
          step.message,
          () => tour.next(),
          () => tour.back()
        ),
        classes: 'custom-shepherd-popup',
        when: {
          show: () => setCurrentStepIndex(index),
        },
      });
    });

    tour.on('show', () => {
        const currentStep = tour.getCurrentStep();
        if (currentStep && onStepChange) {
        onStepChange(currentStep.id);
        }
    });

    tour.on('cancel', () => {
      document.body.style.overflow = 'auto';
      setTourInstance(null);
      setCurrentStepIndex(-1);
    });

    tour.on('complete', () => {
      document.body.style.overflow = 'auto';
      onComplete?.();
      setTourInstance(null);
      setCurrentStepIndex(-1);
    });

    setTourInstance(tour);
    tour.start();
  };

  const nextStep = () => {
    tourInstance?.next();
  };

  const backStep = () => {
    tourInstance?.back();
  };

  return {
    startTour,
    currentStep: steps[currentStepIndex],
    currentIndex: currentStepIndex,
    totalSteps: steps.length,
    onNext: nextStep,
    onBack: backStep,
    isTourActive: !!tourInstance,
  };
};
