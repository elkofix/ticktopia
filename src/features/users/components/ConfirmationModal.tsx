import { Button } from "@/shared/components/Button";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";

export const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isLoading 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
      </TransitionChild>

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-lg font-medium leading-6 text-gray-900"
              >
                ¿Estás seguro de que quieres cerrar tu cuenta?
              </DialogTitle>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Esta acción es irreversible. Todos tus datos serán eliminados permanentemente y no podrás recuperarlos.
                </p>
              </div>

              <div className="mt-4 flex space-x-3">
                <Button
                  variant="danger"
                  disabled={isLoading}
                  onClick={onConfirm}
                >
                  {isLoading ? 'Procesando...' : 'Sí, cerrar mi cuenta'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancelar
                </Button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </Transition>
)